import { createError, errorTypes } from './errors';
import { checkParamsType, checkType, getParam } from './actions';
import * as _ from 'lodash';

describe('Api getParam', () => {
  it('Passes correct response.data', () => {
    const conditions = [
      {
        response: {
          data: {
            test: 1,
          },
        },
      },
    ];

    return Promise.all(
      conditions.map(({ response }) =>
        getParam('data')(response).then(resp =>
          expect(resp).to.deep.equal({
            test: 1,
          })
        )
      )
    );
  });
  it('Throws if response.data not exists', () => {
    const conditions = [
      {
        response: '',
        error: createError(
          errorTypes.INCORRECT_RESPONSE,
          'Expected server response to have param data'
        ),
      },
      {
        response: {
          data: null,
        },
        error: createError(
          errorTypes.INCORRECT_RESPONSE,
          'Expected server response to have param data'
        ),
      },
      {
        response: {},
        error: createError(
          errorTypes.INCORRECT_RESPONSE,
          'Expected server response to have param data'
        ),
      },
    ];

    return Promise.all(
      conditions.map(({ response, error }) =>
        getParam('data')(response).catch(e => {
          expect(e).to.exist.and.be.instanceof(Error);
          expect(e).to.have.property('name', errorTypes.INCORRECT_RESPONSE);
          expect(e).to.have.property('message', error.message);
        })
      )
    );
  });
});

describe('Api checkType', () => {
  it('Passes response of correct type', () => {
    const conditions = [
      {
        type: 'object',
        response: {},
      },
      {
        type: 'array',
        response: [],
      },
      {
        type: 'string',
        response: '',
      },
      {
        type: 'number',
        response: 0,
      },
    ];

    return Promise.all(
      conditions.map(({ type, response }) =>
        Promise.resolve(response)
          .then(checkType(type))
          .then(resp => expect(resp).to.deep.equal(response))
      )
    );
  });
  it('Throws on incorrect response type', () => {
    const conditions = [
      {
        type: 'array',
        response: {},
        error: createError(
          errorTypes.INCORRECT_RESPONSE,
          'Expected server response type: array, actual: [object Object]'
        ),
      },
      {
        type: 'object',
        response: [],
        error: createError(
          errorTypes.INCORRECT_RESPONSE,
          'Expected server response type: object, actual: [object Array]'
        ),
      },
      {
        type: 'object',
        response: '',
        error: createError(
          errorTypes.INCORRECT_RESPONSE,
          'Expected server response type: object, actual: [object String]'
        ),
      },
      {
        type: 'object',
        response: 0,
        error: createError(
          errorTypes.INCORRECT_RESPONSE,
          'Expected server response type: object, actual: [object Number]'
        ),
      },
      {
        type: 'object',
        response: null,
        error: createError(
          errorTypes.INCORRECT_RESPONSE,
          'Expected server response type: object, actual: [object Null]'
        ),
      },
      {
        type: 'object',
        error: createError(
          errorTypes.INCORRECT_RESPONSE,
          'Expected server response type: object, actual: [object Undefined]'
        ),
      },
    ];

    return Promise.all(
      conditions.map(({ response, type, error }) =>
        Promise.resolve(response)
          .then(checkType(type))
          .catch(e => {
            expect(e).to.exist.and.be.instanceof(Error);
            expect(e).to.have.property('name', errorTypes.INCORRECT_RESPONSE);
            expect(e).to.have.property('message', error.message);
          })
      )
    );
  });

  it('should check props type', function() {
    const testObj = {
      prop1: 1,
      prop2: '1',
      prop3: [1, 2],
    };

    function isTestObj(obj) {
      return Boolean(
        typeof obj !== 'undefined' &&
          typeof obj.prop1 !== 'undefined' &&
          typeof obj.prop2 !== 'undefined' &&
          typeof obj.prop3 !== 'undefined' &&
          _.isNumber(obj.prop1) &&
          _.isString(obj.prop2) &&
          _.isArray(obj.prop3)
      );
    }

    const conditions = [
      {
        isType: isTestObj,
        response: testObj,
        error: false,
      },
      {
        isType: isTestObj,
        response: {},
        error: false,
      },
    ];

    return Promise.all(
      conditions.map(({ response, isType, error }) =>
        Promise.resolve(response)
          .then(checkParamsType(isTestObj))
          .then(data => {
            expect(error).to.be(false);
            expect(data).to.have.property('prop1', testObj.prop1);
            expect(data).to.have.property('prop2', testObj.prop2);
          })
          .catch(e => {
            expect(e).to.exist.and.be.instanceof(Error);
            expect(e).to.have.property('name', errorTypes.INCORRECT_RESPONSE);
            expect(e).to.have.property('message', error.message);
          })
      )
    );
  });
});
