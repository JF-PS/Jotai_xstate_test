import { assign, createMachine } from 'xstate';
import type { PeopleType } from '../types';
import { fetchApi } from '../utils';

interface Context {
  data: PeopleType[];
  currentPage: number;
  take: number;
  skip: number;
  totalPage: number;
}
type FETCH = { type: 'FETCH' };
type GO_TO_PAGE_NUMBER_CLICK = {
  type: 'GO_TO_PAGE_NUMBER_CLICK';
  currentPage: number;
};

type SELECT_TAKE_CLICK = {
  type: 'SELECT_TAKE_CLICK';
  take: number;
};

type SKIP_CLICK = {
  type: 'SKIP_CLICK';
  skip: number;
};

const createDataGridMachine = (apiName: string) =>
  /** @xstate-layout N4IgpgJg5mDOIC5QQIYBcUFooCcCWEmAtigMYAWeAdmAHQA2A9ihNVAMQSM23UBujANZ1UGbPkIkK1OkxZsE-RqXR5uAbQAMAXS3bEoAA6NYeNGqoGQAD0QBGABwBmWgBYnAJg9On7gJyuAKyBXgA0IACeiK4AbHa0Dg6BAOxedjHOfjGuAL454aJYuATEZJQ8cqxUHGA4OIw4tIb06ABmDUS0heIlUuWyzFVQilQCKuYaOnpWxqYTlkg2iJg+frTJdilByX4ezh6B4VEITkkJyZpeDjGXdht+eQXoRRKl0jxUKHx4UKrV7ABxADyAH0ACqggAKAEEAQBREEAOQAqgBZABCcIASiCAMIAGQAkriANLTRazMwWKy2BCYDwxWhZQKJVx2XyaQIxJwxZJHRCpZK0Dx+PwswKaWIHQJOR4gbrFSRlGS0T7fX7mf4AZTh+LhuLB4OhJIRBOJZJ0MxMVO4NOWHlcmloMTip3Sdyc6UOkUQLIctFWG2uMS5p0CeXyICojAgcCsCtefRVlTYVrm1MWtM0-JOcXWXuSyRCos0qTlCd6yp4rRQeHoAFccGA0zaFqAsznAnZXG4AposkXAn4HN3y88ekr3nQ1T8-lAW-M7Qhsz6ENzGR47JpsgE-JonFzcpGK5P+guM+3lqchRstildvtvccPKl1jLNFu7Jth64ixGckAA */
  createMachine<
    Context,
    GO_TO_PAGE_NUMBER_CLICK | SELECT_TAKE_CLICK | SKIP_CLICK | FETCH
  >(
    {
      context: {
        data: [],
        currentPage: 0,
        take: 6,
        skip: 6,
        totalPage: 0
      },
      predictableActionArguments: true,
      id: 'data-grid-machine',
      initial: 'loading',
      states: {
        loading: {
          invoke: {
            src: () => fetchApi(apiName),
            onDone: [
              {
                target: 'navigating',
                actions: ['setData', 'setTotalPage']
              }
            ],
            onError: [
              {
                target: 'failure'
              }
            ]
          }
        },
        failure: {},
        navigating: {
          on: {
            GO_TO_PAGE_NUMBER_CLICK: {
              target: 'navigating',
              actions: ['setCurrentPage', 'setSkip'],
              internal: false
            },
            SELECT_TAKE_CLICK: {
              target: 'navigating',
              actions: ['setTake', 'setSkip', 'setTotalPage'],
              internal: false
            }
          }
        }
      }
    },
    {
      actions: {
        setData: assign((_: Context, event: any) => {
          const { data } = event;
          return { data };
        }),
        setTotalPage: assign((context: Context, event: any) => {
          const { data: dataEvent } = event;
          const { take, data: dataContext } = context;
          const data = dataEvent || dataContext;
          return { totalPage: Math.ceil(data.length / take) };
        }),
        setCurrentPage: assign((_: Context, event: any) => {
          const { currentPage } = event;
          return { currentPage };
        }),
        setTake: assign((_: Context, event: any) => {
          const { take } = event;
          return { take };
        }),
        setSkip: assign((context: Context) => {
          const { currentPage, take } = context;
          return { skip: Math.ceil(currentPage * take - take) };
        })
      },
      guards: {}
    }
  );

export default createDataGridMachine;
