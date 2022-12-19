import { atom } from 'jotai';
import { atomWithMachine } from 'jotai/xstate';
import { Context } from 'react';
import { actions, assign, createMachine, raise } from 'xstate';
import { send } from 'xstate';
import { defaultValuesAtom } from '../louis-atoms';
import { PeopleType } from '../types';
import { fetchApi } from '../utils';

interface error {
  message: string;
  type: 'unknow' | 'fetch';
  attempts?: number;
}

interface IPaginatioMachineContext {
  skip: number;
  DataRowsNumber: number;
  RowsPerPage: number;
  MaxPageNumber: number;
  actualPage: number;
  Data: PeopleType[] | null;
  error: error | null;
  counter: number;
}

type PaginationMachineEvents = { type: 'INITMESSAGE' } | {};

const createPaginationMachine = (context: IPaginatioMachineContext) =>
  /** @xstate-layout N4IgpgJg5mDOIC5QAUCGUCWA7VAXDA9lgLKoDGAFtmAHTYa4DEAkgHLMAqA2gAwC6iUAAcCsBoSyCQAD0QBaAOwAmGgE4AjDx4KALEqUKAzKp0A2UwBoQAT0RKArPZqGlADh73V+0zp099AL4BVmiYOPhEpJTUNABmYLiUjBBEtNgAbgQA1rTxiRQAqrBgAE6wvAJIICJiEZJVsgjqTvY8qi5KOvbqCuqGhq6uVrYI9no0ngqmrvam6jruzUEh6Nh4ElFUWLkJSaUlBCU0QgA2eLGHALZxu4XFZRVSNeJEUo1yrU6dWq0epkrmVTDRD2XQ0LrqLwKH6Q3zLEChNZ1TYxPJ7EoHI6nc5XG75IqlcrqSrCUQveqgd4LHjOPT-HSqExeHTqYEIaE0wzqBz9Ln2Vw+ezwxHhDbkLZpCAnMCMVgAUQAGhxkABBADicseVWedTeiHM6mc810APaplU9iUbMcqmcbUMPzGynMwtWosi4piGClMuQACU5QA1ZgAeQKAGVVRqtaTahI9QgfIYaHN-h42gpGV42V0nO11K4lOo+q52oXDK6wusPdFtnQfYxw3LlerNfwnmTdQ19V0aLoC35DNDXDplGzDL41D5NP5IQWlsEEW7qyRPXXvdLGAAZFXhlvR9vazvx7uJuZqMwAicLVTTNmQ23c3quQyzfoA9SVpFi2uSzcAMWYP09yjNsSWqY9XlPcwFBoLQjB4UsDC6PQ2SmFMemUHktBZRwv3dVdf3rTcmw4P0QwAdUjOU-VAmMILjKDKUQPwnHmV9tHNHp+UsGx5G5FRzAZUwjDTVQeDheEsAICA4CkEUVxRbYO0YikZHkRxk2+dM-gBc02TkIsaWaHhBVUBRPB0V8hUXBTkTXNIsAYFTyQTORTBaWYekhAVGQsnR7xEvs6RMPwiyMVx8MUhy8UoFyu2YhA5HUc0aAMfp03aVpzJzV81A0VpTH6DzfJslYq3soiNzAeKT0S+c1AMDxxNfFkLKBPimiCk1zV8WcIqiyqJRofZDlqpj1KSqyaVcBCpjmBYXHMHMGTtMZ9AdAY6TKpcKp-YbYjwVATjlDExqPVS3JS1wU06BZi2pHoZjQrQ0oLcSNEzTogiCIA */

  /** @xstate-layout N4IgpgJg5mDOIC5QAUCGUCWA7VAXDA9lgLKoDGAFtmAHTYa4DEAkgHLMAqA2gAwC6iUAAcCsBoSyCQAD0QBaAOwAmGgE4AjDx4KALEqUKAzKp0A2UwBoQAT0RKArPZqGlADh73V+0zp099AL4BVmiYOPhEpJTUNABmYLiUjBBEtNgAbgQA1rTxiRQAqrBgAE6wvAJIICJiEZJVsgjqTvY8qi5KOvbqCuqGhq6uVrYI9no0ngqmrvam6jruzUEh6Nh4ElFUWGkQADZgjKwAogAaHMgAggDiRxVSNeJEUo3m6s7zukqm7d-2SsOIRyqZxtQxaRw6ZTmZYgUJrOqbGIYPYHZAAJSOADVmAB5AoAZUuNzuVQedWeiB8hhoc1MSg8bQUqmZ-xsiC6Tna6lcSnUfVc7R5hhhcPCG3IWx2+0Y+KO52ut3491Ej3qoBeXRoum5fkMCh4rkhrJGhl8ah8mn86g0riWwVhqzFkQlSJRjAAMhd8fLiUrSSryQ1KXM1GYvqaFqppgCmsyaOoDNzDLN+l91CLHetndFtnQ3QAxZho71ExWVYQBiQUhDmBQ0LRGA1eXRjY2IKY0nrKBxgng6Zr2DNhLMkF255HS2UcNE4gDqhKOaNLJIrtSrQYQfic82T2m+PXsrksbIQcgTKnMOijRjpbT7OiH8PFOdyCSSpRKBBKNCEuzwsS-ABbOI30KYoyhXapKyeDc5FaJxOnBcE6XMVQY3sXQaC6a0DHBa1fEfJ1RxfED8kYD8vx-P9cAAkpgLySgilKcp1HLKC1xg9V5AWHhnD0OkrxMLx+xjfVeMMBN7H6CTDx8QcYSwAgIDgKRRRHRFtmVDi1RkeRHGpRCGQ8FDvhjOReV45oeDk1QFE8HRk1cQj1LHNIsAYLTVWrORTBaWYemtI9mTsnQY3UUw60+b5fCtIwnPtNSEVc0jKE8wMuNPcLgQMfoGXaVpbJjBzOQ0VpTH6XygvklZhySkiJzANL1wy7k3mbDxVB4ZN+zstCT3CyL+JMPxeTi5y6slGgKJKJrON008RucYxXh8BYlAkoqjwmfK9T+NwBXimqn2zSbYjwVBdiOEpPxm-1tO88LXBpToFj5HiehmUStBoXkBTaHphKCIIgA */

  /** @xstate-layout N4IgpgJg5mDOIC5QAUCGUCWA7VAXDA9lgLKoDGAFtmAHTYa4DEAkgHLMAqA2gAwC6iUAAcCsBoSyCQAD0QBaAOwAmGgE4AjDx4KALEqUKAzKp0A2UwBoQAT0RKArPZqGlADh73V+0zp099AL4BVmiYOPhEpJTUNABmYLiUjBBEtNgAbgQA1rTxiRQAqrBgAE6wvAJIICJiEZJVsgjqTvY8qi5KOvbqCuqGhq6uVrYI9no0ngqmrvam6jruzUEh6Nh4ElFUWGkQADZgjKwAogAaHMgAggDiRxVSNeJEUo3m6s7zukqm7d-2SsOIRyqZxtQxaRw6ZTmZYgUJrOqbGIYPYHZAAJSOADVmAB5AoAZUuNzuVQedWeiB8hhoc1MSg8bQUqmZ-xsiC6Tna6lcSnUfVc7R5hhhcPCG3IWx2+0Y+KO52ut3491Ej3qoBeXRoum5fkMCh4rkhrJGhl8ah8mn86g0riWwVhqzFkQlSJRjAAMhd8fLiUrSSryQ1KXM1GYvqaFqppgCmsyaOoDNzDLN+l91CLHetndFtnQ3QAxZho71ExWVYQBiQUhDmBQ0LRGA1eXRjY2IKY0nrKBxgng6Zr2DNhLMkF255HS2UcNE4gDqhKOaNLJIrtSrQYQfic82T2m+PXsrksbIQcgTKnMOijRjpbT7OiH8PFOdyCSSpRKBBKNCEuzwsS-ABbOI30KYoyhXapKyeDc5FaJxOnBcE6XMVQY3sXQaC6a0DHBa1fEfJ1RxfED8kYD8vx-P9cAAkpgLySgilKcp1HLKC1xg9V5CvYFei8HgeleLt7BjXo3lcZNXAUIVZiUQx03tUUR0RXMKJKRgjnSMAsFwAACdRILJdcuNPU1qVbfpTDBTQui6GNLM7No9EWNxuiCe0sAICA4CkJSETHMBlQ4tUZHkRxqUQhkPBQ74YzkXkeHjVofEmTwdGTQdFMzfySPoXAgtVas5FMFpZh6a0j2ZBQxhjdRTDrT5vl8K0jFcQjlIC0jKAKwMTLPb4aAMfoGXaVpVAUGN0s5DRkssw9fnanLJTzfYeuM0KmltNRcM8Hhk37aq0JPOqGr0Jq-F5VrFufZa1LWziNrkC7nGMEqjwFLx7H6SbPCwqTwuMHsfGu7NltiPBUF2I4Sk-Ep7pCxp+tcGlOgWPkFgE6SRJPfVEt5AU2h6LwH3coA */
  createMachine<
    IPaginatioMachineContext,
    | { type: 'NEXTPAGE' }
    | { type: 'LASTPAGE' }
    | { type: 'INIT' }
    | { type: 'PREVIOUSPAGE' }
    | { type: 'FIRSTPAGE' }
    | { type: 'RETRY' }
    | { type: 'STOPATTEMPTS' }
    | { type: 'SETPAGE'; pageNumber: number }
    | { type: 'SETROWSPERPAGE'; number: number }
  >(
    {
      predictableActionArguments: true,
      id: 'PaginationMachine',
      initial: 'init',
      context: context,
      states: {
        init: {
          on: {
            INIT: {
              target: 'fetch'
            }
          }
        },

        fetch: {
          invoke: {
            id: 'fetchUsers',

            src: () => {
              console.log('fetch');

              return fetchApi('peopleds');
            },

            onDone: {
              target: 'idle',
              actions: ['setData', 'setDataRowsNumber', 'setMaxPageNumber']
            },

            onError: [
              {
                target: 'fatalError',
                cond: 'shouldRetry'
              },
              {
                target: 'error',
                cond: 'shouldRetry',
                actions: 'IncreaseCounterRetry'
              }
            ]
          }
        },

        idle: {
          on: {
            NEXTPAGE: {
              target: 'idle',
              actions: ['nextPage']
            },
            PREVIOUSPAGE: {
              target: 'idle',
              actions: ['previousPage']
            },
            SETPAGE: {
              target: 'idle',
              actions: ['setPageNumber']
            },
            LASTPAGE: {
              target: 'idle',
              actions: ['lastPage']
            },
            FIRSTPAGE: {
              target: 'idle',
              actions: ['firstPage']
            },
            SETROWSPERPAGE: {
              target: 'idle',
              actions: ['setRowsPerPage', 'setMaxPageNumber']
            }
          }
        },

        error: {
          on: {
            'Event 1': [
              {
                target: 'fetch',
                actions: 'ShowErrorAndWait'
              },
              'fetch'
            ]
          }
        },

        fatalError: {
          entry: ['setError']
        }
      }
    },
    {
      actions: {
        setPageNumber: assign(
          (context: IPaginatioMachineContext, event: any) => {
            let { actualPage } = context;
            actualPage = event.pageNumber;
            return { actualPage };
          }
        ),
        nextPage: assign((context: IPaginatioMachineContext) => {
          let { actualPage } = context;
          actualPage += 1;
          return { actualPage };
        }),
        lastPage: assign((context: IPaginatioMachineContext) => {
          let { actualPage, MaxPageNumber } = context;
          actualPage = MaxPageNumber;
          return { actualPage };
        }),
        previousPage: assign((context: IPaginatioMachineContext) => {
          let { actualPage } = context;
          actualPage -= 1;
          return { actualPage };
        }),
        firstPage: assign((context: IPaginatioMachineContext) => {
          let { actualPage } = context;
          actualPage = 0;
          return { actualPage };
        }),
        setRowsPerPage: assign(
          (context: IPaginatioMachineContext, event: any) => {
            let { RowsPerPage } = context;
            RowsPerPage = event.number;
            return { RowsPerPage };
          }
        ),
        setMaxPageNumber: assign((context: IPaginatioMachineContext) => {
          let { MaxPageNumber, DataRowsNumber, RowsPerPage } = context;
          MaxPageNumber = Math.ceil(DataRowsNumber / RowsPerPage) - 1;
          return { MaxPageNumber };
        }),
        setData: assign(
          (context: IPaginatioMachineContext, event: any) => {
            let { Data } = context;
            Data = event.data;
            return { Data };
          }
        ),
        setDataRowsNumber: assign(
          (context: IPaginatioMachineContext, event: any) => {
            let { DataRowsNumber } = context;
            console.log({ event });

            DataRowsNumber = event.data.length;
            return { DataRowsNumber };
          }
        ),
        setError: assign(
          (context: IPaginatioMachineContext, event: any) => {
            let error = {
              message: '---- setError ----',
              type: 'fetch',
              attempts: 12
            };
            console.log('✌️');

            return { error };
          }
        ),
        IncreaseCounterRetry: assign(
          (context: IPaginatioMachineContext, event: any) => {
            let { counter } = context;
            counter += 1;
            return { counter };
          }
        )
      },
      guards: {
        shouldRetry: (context: IPaginatioMachineContext, event: any) => {
          console.log('should retry');

          const { counter } = context;
          return counter <= 5;
        }
      }
    }
  );

export const paginationMachineAtom = atomWithMachine((get) =>
  createPaginationMachine(get(defaultValuesAtom))
);
