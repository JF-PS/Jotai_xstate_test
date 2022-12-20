import React, { Context } from 'react';

import { atom } from 'jotai';
import { atomWithMachine } from 'jotai/xstate';
import { actions, assign, createMachine, raise, send } from 'xstate';

import { fetchApi } from '../utils';
import { PeopleType } from '../types';
import { defaultValuesAtom } from '../louis-atoms';

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
  error: error | {};
  counter: number;
  timer: number;
  fetchUrl: string;
}

const createPaginationMachine = (context: IPaginatioMachineContext) =>
  /** @xstate-layout N4IgpgJg5mDOIC5QAUCGUCWA7VAXDA9lgLKoDGAFtmAHTYa4DEAkgHLMAqA2gAwC6iUAAcCsBoSyCQAD0QBaAOwAmGgE4AjDx4KALEqUKAzKp0A2UwBoQAT0RKArPZqGlADh73V+0zp099AL4BVmiYOPhEpJTUNABmYLiUjBBEtNgAbgQA1rTxiRQAqrBgAE6wvAJIICJiEZJVsgjqTvY8qi5KOvbqCuqGhq6uVrYI9no0ngqmrvam6jruzUEh6Nh4ElFUWLkJSaUlBCU0QgA2eLGHALZxu4XFZRVSNeJEUo1yrU6dWq0epkrmVTDRD2XQ0LrqLwKH6Q3zLEChNZ1TYxPJ7EoHI6nc5XG75IqlcrqSrCUQveqgd4LHjOPT-HSqExeHTqYEIaE0wzqBz9Ln2Vw+ezwxHhDbkLZpCAnMCMVgAUQAGhxkABBADicseVWedTeiHM6mc810APaplU9iUbMcqmcbUMPzGynMwtWosi4piGClMuQACU5QA1ZgAeQKAGVVRqtaTahI9QgfIYaHN-h42gpGV42V0nO11K4lOo+q52oXDK6wusPdFtnQfYxw3LlerNfwnmTdQ19V0aLoC35DNDXDplGzDL41D5NP5IQWlsEEW7qyRPXXvdLGAAZFXhlvR9vazvx7uJuZqMwAicLVTTNmQ23c3quQyzfoA9SVpFi2uSzcAMWYP09yjNsSWqY9XlPcwFBoLQjB4UsDC6PQ2SmFMemUHktBZRwv3dVdf3rTcmw4P0QwAdUjOU-VAmMILjKDKUQPwnHmV9tHNHp+UsGx5G5FRzAZUwjDTVQeDheEsAICA4CkEUVxRbYO0YikZHkRxk2+dM-gBc02TkIsaWaHhBVUBRPB0V8hUXBTkTXNIsAYFTyQTORTBaWYekhAVGQsnR7xEvs6RMPwiyMVx8MUhy8UoFyu2YhA5HUc0aAMfp03aVpzJzV81A0VpTH6DzfJslYq3soiNzAeKT0S+c1AMDxxNfFkLKBPimiCk1zV8WcIqiyqJRofZDlqpj1KSqyaVcBCpjmBYXHMHMGTtMZ9AdAY6TKpcKp-YbYjwVATjlDExqPVS3JS1wU06BZi2pHoZjQrQ0oLcSNEzTogiCIA */

  /** @xstate-layout N4IgpgJg5mDOIC5QAUCGUCWA7VAXDA9lgLKoDGAFtmAHTYa4DEAkgHLMAqA2gAwC6iUAAcCsBoSyCQAD0QBaAOwAmGgE4AjDx4KALEqUKAzKp0A2UwBoQAT0RKArPZqGlADh73V+0zp099AL4BVmiYOPhEpJTUNABmYLiUjBBEtNgAbgQA1rTxiRQAqrBgAE6wvAJIICJiEZJVsgjqTvY8qi5KOvbqCuqGhq6uVrYI9no0ngqmrvam6jruzUEh6Nh4ElFUWGkQADZgjKwAogAaHMgAggDiRxVSNeJEUo3m6s7zukqm7d-2SsOIRyqZxtQxaRw6ZTmZYgUJrOqbGIYPYHZAAJSOADVmAB5AoAZUuNzuVQedWeiB8hhoc1MSg8bQUqmZ-xsiC6Tna6lcSnUfVc7R5hhhcPCG3IWx2+0Y+KO52ut3491Ej3qoBeXRoum5fkMCh4rkhrJGhl8ah8mn86g0riWwVhqzFkQlSJRjAAMhd8fLiUrSSryQ1KXM1GYvqaFqppgCmsyaOoDNzDLN+l91CLHetndFtnQ3QAxZho71ExWVYQBiQUhDmBQ0LRGA1eXRjY2IKY0nrKBxgng6Zr2DNhLMkF255HS2UcNE4gDqhKOaNLJIrtSrQYQfic82T2m+PXsrksbIQcgTKnMOijRjpbT7OiH8PFOdyCSSpRKBBKNCEuzwsS-ABbOI30KYoyhXapKyeDc5FaJxOnBcE6XMVQY3sXQaC6a0DHBa1fEfJ1RxfED8kYD8vx-P9cAAkpgLySgilKcp1HLKC1xg9V5AWHhnD0OkrxMLx+xjfVeMMBN7H6CTDx8QcYSwAgIDgKRRRHRFtmVDi1RkeRHGpRCGQ8FDvhjOReV45oeDk1QFE8HRk1cQj1LHNIsAYLTVWrORTBaWYemtI9mTsnQY3UUw60+b5fCtIwnPtNSEVc0jKE8wMuNPcLgQMfoGXaVpbJjBzOQ0VpTH6XygvklZhySkiJzANL1wy7k3mbDxVB4ZN+zstCT3CyL+JMPxeTi5y6slGgKJKJrON008RucYxXh8BYlAkoqjwmfK9T+NwBXimqn2zSbYjwVBdiOEpPxm-1tO88LXBpToFj5HiehmUStBoXkBTaHphKCIIgA */

  /** @xstate-layout N4IgpgJg5mDOIC5QAUCGUCWA7VAXDA9lgLKoDGAFtmAHTYa4DEAkgHLMAqA2gAwC6iUAAcCsBoSyCQAD0QBaAOwAmGgE4AjDx4KALEqUKAzKp0A2UwBoQAT0RKArPZqGlADh73V+0zp099AL4BVmiYOPhEpJTUNABmYLiUjBBEtNgAbgQA1rTxiRQAqrBgAE6wvAJIICJiEZJVsgjqTvY8qi5KOvbqCuqGhq6uVrYI9no0ngqmrvam6jruzUEh6Nh4ElFUWLkJSaUlBCU0QgA2eLGHALZxu4XFZRVSNeJEUo1yrU6dWq0epkrmVTDRD2XQ0LrqLwKH6Q3zLEChNZ1TYxPJ7EoHI6nc5XG75IqlcrqSrCUQveqgd46VSqGi9Lw8HrmdQ9BT2YEIXrqGiuQz2VwKVxKPn-QzqeGI8IbchbNIQE5gRisACiAA0OMgAIIAcWVjyqzzqb0QzOc810APaplU9iUHMctMMbSdHjGynMEtWUsiMpiGHliuQACVlQA1ZgAeQKAGUtbr9aTahJjQgfIYaHN-h42goaV4OV0nO11EKWQN2kLDJ6wusfdFtnQA4xo8qNTq9fwnmSjQ0TV06ToS35DNDXDplBzDL41D5NP5ISWlsEEV7ayRfQ3-QrGAAZTXRtvxzsG7vJ3upuZqMwAqcLVTTDmQ2nqAwlkX9AHi5eStcozdNgAxZggwPOMOxJapT1ec9zAUGgtCMHhXChLo9A5KYM1ZfR7BdQdHGrJFpXrOVtxbDggwjAB1WNlSDMCE0gpNoMpRA-CceY+W0a0en5SwbHkF8VHMalTCMLNVB4OFv1XZEN1ofZDkYZV0jALBcAAAnUBjDTPFiEDkKd0zGYVDFMJ1NFQ9l+IQfpTEwto9EWNxugI7112ImgFJKJSVLUzSuGJLsmIpGR5CUF8eT8e9+nUMyJJ6Dk3FceyTDcRlnK-ZcsAICA4CkH9ZOIoLyRTD4cJob5sz+AFrQ5ORwp4Ghmh4HwuTmVwelc385LoLAGGKns9LkUwWlmHpIVca1VDZHRH1EgdLV8ecjFcLrCtlPFKAG3TQv02LaQMfps3aVppoLPk1A0VozNM3ibTWoiNq3MBtuY3bFzUAwPAkvlBzZIFrNiuCLWtJbwpWh66w2rzXpCql-GcYwRsm5CvBwwwC08cEBUcfo0dMnRIfcjbYjwVATmVDFDlh0rYuS-5fA6+ZFkFKyRmhRrwuQtoei8QmggCIA */

  /** @xstate-layout N4IgpgJg5mDOIC5QAUCGUCWA7VAXDA9lgLKoDGAFtmAHTYa4DEAkgHLMAqA2gAwC6iUAAcCsBoSyCQAD0QBaAOwAmGgE4AjDx4KALEqUKAzKp0A2UwBoQAT0RKArPZqGlADh73V+0zp099AL4BVmiYOPhEpJTUNABmYLiUjBBEtNgAbgQA1rTxiRQAqrBgAE6wvAJIICJiEZJVsgjqTvY8qi5KOvbqCuqGhq6uVrYI9no0ngqmrvam6jruzUEh6Nh4ElFUWLkJSaUlBCU0QgA2eLGHALZxu4XFZRVSNeJEUo1yrU4Lxq4Krar2VyGdTDRBzBRqVSDabGHh9UyqZYgUJrOqbGJ5PYlA5HU7nK43fJFUrldSVYSiF71UDvHSqVRqUzAszdHrqBGghAKVwqBbuHg+Qx6bSmJEo8IbchbNIQE5gRisACiAA0OMgAIIAcUVjyqzzqb0QmnaNF0Ux0PzMLkMnN0LWmQK0Rk8vzFqwlkSlMQwsvlyAASoqAGrMADyBQAyhrtbqKbUJIaEF4dGplFNHF5jOzOeZ1DR1K4-GYzOpOj03WF1p7ots6L7GBHFWqtTr+E9KQaGogpgyeL8lKp-IWBa5VJzZhDeuy+rDuY4K6jJTWZXLGAAZdUR5sxtt6jsJrsIUz2Qz54H6dMA0y9TkLFMI4F9P6-Qw8QwLj0kL21n2rgBizD+lu0atuS1T7q8h72Eopg0L4-jzPYvTeCCNiIAMKjcqoChaM0UIIjBH5Vl+y51qujYcP6oYAOpRoq-ogbG4HxpBNLoYYThwqo5jtFCbgDDonKdBCJjcf4fYwcC2FEWi360IGlEAJqMEx+oHmxCAfFMND+GYSilgMHHZmhCB6K4+Y4VoonmPphZBMEIBYAQEBwFI4rEei2ztix1IyPICgAjQ7gDDM+g8BaMGcu4NAODhnReIMCgBToMlLtKdBYAw3lUomcjHhMsxsvh9J-IJJnspOegIvB+lGK4qXVulmIUNlnYaXIr7mUWBhws0x56GVIwRTF6iaD1AoEWYDUkelv5gK16l+U0rh5l4OGeG+Yw9J4nIVaaVUmH4tUDNNnnyU2-qKQtrFLXlCwTOoJhhUhgKDYgfIWVobR0jZBYpQ57myaRsR4KgJyKtihzXb57xmkFb6DNBSjhS4lgmemMUra+zR0n0K32QEQA */

  /** @xstate-layout N4IgpgJg5mDOIC5QAUCGUCWA7VAXDA9lgLKoDGAFtmAHTYa4DEAkgHLMAqA2gAwC6iUAAcCsBoSyCQAD0QBaAOwBOAMw0eANgCsCnpqUBGBQBYFBgDQgAnvIBMagxqcrjWgwA4DSrZoUBfP0s0TBx8IlJKajosBkZeASQQETEwyUTZBDklPRoDHgV3dy1jD11jd0sbBA8DGmMVHlslcoUtZqVbYwCg9Gw8CQiqLFoAMzBcSkYIIlpsADcCAGtR8coAVVgwACdYeKlk8SIpDLkGrVyeY1sed2MSjTz8ysQrnhpbW3cNBR+VDVvit0QME+qlBlExhMKIxtlsCFsaEIADZ4EbwgC2NEh602Oz2iQOqWO8hUWjU7lUtg0H2pRQ0xmeCF050c9Xcek0KlsCg0QJBoQG5CGKyhMK2cIRyNRGKxqwoG22uwMCWEokOaVAJxc7hoKgUnTadx07gULkZJo0dQp7LMH2KPCUfN6AvCQqiGAgSLAjFYAFEABocZAAQQA4r78aqUhJidVuW8jK9fjTCoylCaaNlCjdbDoOQYnSF+q7IsM6J7vcgAEq+gBqzAA8msAMoh8ORpJqonpRAGPK1FRKSmqYx6T5pnhqLSdRrGelz+oFwLA53Fkhusser2MZu+oNhiP8fZdmM9hDNc5uFRFUcqIw8LRac15dRuNoGHQlL6O5f8tfgzcK0YAAZYNm33dsjwJE8jjPdwmhoR8fkMUd9UnBRGX1BR1BUBpDGaWwDDvfxf1XMEN1mICADFmCrcC20PFVO2jWDNUQXRbBoL5vgKO9CmpJ9rEQATciab53BcLldF5Uii3I0tKO3XcOCrBsAHVW19KsGI7QlTzYhBjHTGgNA6Ic5yKH5tEZR9jDqMkzD+H4iJ+QtQUFBSaBrFSAE1GF8sNgzYXSYI1GR5E8WpTSafINB4AxPiIxlRzsjwLJNbxvgStyXXXTzvKrPzpFgXA8FoVARlwbYAAoCp8gB9AARX1QJ8gBKRg-3k4UvL3QqQpYsKTn+bDygS0c+1uRwMKEwyHxMoouSUf5sgaEiejkjyepGPBUCRX1xXhRgqzgUqtlwAb1VjOR+043NVHpUyb1MTCM1w4oJLvbRrncAJlywAgIDgKQuq26hj0G668ji942j+Od02KF7Zpul9vrvQcpKpLwcv-CjogYCGrrPOQvh1bIhycDQXE6fVMLeSlXFHJpry+Wxce6iE5SJ7sDLkMk1DMZaOiMpweQqWaqVGv5cy0JxTD+DmwcAr0ef08LqiMGhdC+STsfTPtkruRCfHKa5pzvRMlZLHq6rV1iNa15oCnsD5TUHRbGW+Oy0NJalmj1Qdrby7bdv2w6tntobEE6Lj-lnCkP1Mi9nyUEzGlJFpykuP6-CAA */
  createMachine<
    IPaginatioMachineContext,
    | { type: 'NEXTPAGE' }
    | { type: 'LASTPAGE' }
    | { type: 'INIT'; fetchUrl: string }
    | { type: 'PREVIOUSPAGE' }
    | { type: 'FIRSTPAGE' }
    | { type: 'RETRY' }
    | { type: 'Restart' }
    | { type: 'TRYAGAIN' }
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
              target: 'init',
              actions: ['setFetchUrl'],
              internal: true
            }
          },

          always: {
            target: 'fetch',
            cond: 'hasfetchUrl'
          }
        },

        fetch: {
          invoke: {
            id: 'fetchUsers',

            src: (context) => {
              return fetchApi(context.fetchUrl);
            },

            onDone: {
              target: 'idle',
              actions: ['setData', 'setDataRowsNumber', 'setMaxPageNumber']
            },

            onError: [
              {
                target: 'RETRY',
                cond: 'shouldRetry',
                actions: 'setError'
              },
              { target: 'fatalError' }
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
          },

          entry: 'ResetCounter'
        },

        RETRY: {
          entry: ['IncreaseCounterRetry'],

          after: {
            RETRY_DELAY: { target: 'fetch' }
          },

          on: {
            TRYAGAIN: {
              target: 'fetch'
            }
          }
        },

        fatalError: {
          entry: ['setError'],

          on: {
            Restart: 'init'
          }
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
            let { error } = context;
            console.log(event);

            error = event.data?.request?.status;

            return { error };
          }
        ),
        IncreaseCounterRetry: assign(
          (context: IPaginatioMachineContext, event: any) => {
            let { counter } = context;
            counter += 1;
            return { counter };
          }
        ),
        ResetCounter: assign((context: IPaginatioMachineContext) => {
          context.counter = 0;
          return context;
        }),
        setFetchUrl: assign(
          (context: IPaginatioMachineContext, event: any) => {
            let { fetchUrl } = context;
            fetchUrl = event.fetchUrl;
            return { fetchUrl };
          }
        )
      },
      guards: {
        shouldRetry: (context: IPaginatioMachineContext, event: any) => {
          return context.counter < 4;
        },
        hasfetchUrl: (context: IPaginatioMachineContext) => {
          if (context.fetchUrl) {
            return true;
          }
          return false;
        }
      },
      delays: {
        RETRY_DELAY: (context: IPaginatioMachineContext) => {
          return (context.counter + 1) * 5000;
        }
      }
    }
  );

export const paginationMachineAtom = atomWithMachine((get) =>
  createPaginationMachine(get(defaultValuesAtom))
);
