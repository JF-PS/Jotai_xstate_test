import { atom } from 'jotai';
import { atomWithMachine } from 'jotai/xstate';
import { assign, createMachine } from 'xstate';
import { defaultValuesAtom } from '../louis-atoms';

interface IPaginatioMachineContext {
  skip: number;
  DataRowsNumber: number;
  RowsPerPage: number;
  MaxPageNumber: number;
  actualPage: number;
}

type PaginationMachineEvents = { type: 'INITMESSAGE' } | {};

const createPaginationMachine = (context: IPaginatioMachineContext) =>
  /** @xstate-layout N4IgpgJg5mDOIC5QAUCGUCWA7VAXDA9lgLKoDGAFtmAHTYa4DEuqATjLgNoAMAuoqAAOBWA0JYBIAB6IAjAGZZNAKzdlAJm7z1AFgDs3A-IA0IAJ6JNOmvL0BOPZoBsADj0unT3QF9vptJg4+ESklNR0WAyMAJIActEAKjz8SCDCosESqTIICkqqGlq6BkamFrnK8jQudtwKHupO3HYe8r5+IFgEEHCSAdh44qFUWGCS6WJEkjkAtE5liDPKNHara+trHr7+6AOZw+H0uOMik1mgOfrVOk7yyrJed3eyyvPmci00N-q18jo66nkLjaHX6QSG5BGtAAZmBcGEsFAThlxNNLECbB49LIcc41PoFrkHDRbrIdMoDLJmtwdA5tiAwYMQpDDhAADZjVITTJohD-FaA2R6ZQuHF6JzClyE0VfFyvSViiXKOz0xn7FmjGhgVisAisZFnXkAwkKOwrYXqCluJ73JztbxAA */
  createMachine<IPaginatioMachineContext, { type: 'INIT' }>(
    {
      predictableActionArguments: true,
      id: 'PaginationMachine',
      initial: 'init',
      context: context,
      states: {
        init: {
          on: {
            INIT: {
              target: 'fetching',
              actions: ['initAction']
            }
          }
        },
        fetching: {},
        idle: {},
        error: {}
      }
    },
    {
      actions: {
        initAction: (context: IPaginatioMachineContext) => {
          console.log('hello', context);
        }
      }
    }
  );

export const paginationMachineAtom = atomWithMachine((get) =>
  createPaginationMachine(get(defaultValuesAtom))
);
