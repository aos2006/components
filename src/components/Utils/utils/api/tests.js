import sinon from 'sinon';
import { toJS } from 'mobx';
import { notification } from 'antd';
const actions = require('utils/api/actions');

sinon.mock(actions);
sinon.mock(notification);

export function commonActionWorkflow(params) {
  return function() {
    const {
      serverResponse = {},
      functionParams = [],
      query = {},
      notifications = [],
      logExceptions = [],
      checkStoreParams = {},
      testFunctionName,
      storeClass,
    } = params;

    const store = new storeClass();

    global.logException.resetHistory();

    actions.makeRequest = sinon.stub().returns(serverResponse);
    notification.error = sinon.spy();

    const testFunction = store[testFunctionName];

    expect(testFunction).to.be.a('function', `store.${testFunctionName} не является функцией`);

    return store[testFunctionName](...functionParams).then(() => {
      expect(actions.makeRequest.calledOnce).to.equal(
        true,
        `makeRequest должна быть вызвана лишь один раз`
      );
      expect(actions.makeRequest.args[0][0]).to.deep.equal(
        query,
        `makeRequest вызвана с некорректными параметрами`
      );

      Object.keys(checkStoreParams).forEach(storeParam => {
        expect(toJS(store[storeParam])).to.deep.equal(
          checkStoreParams[storeParam],
          `Параметр ${storeParam} не соответствует ожидаемому`
        );
      });

      if (logExceptions.length > 0) {
        expect(global.logException.callCount).to.equal(
          logExceptions.length,
          'Не совпадает количество ожидаемых вызовов window.logException'
        );

        global.logException.getCalls().forEach(({ args }, i) => {
          const currentArgs = args[0] || {};
          const currentExpected = logExceptions[i];

          expect(currentArgs.name).to.equal(
            currentExpected.name,
            `Тип ошибки не соответствует ожидаемому`
          );
          expect(currentArgs.message).to.equal(
            currentExpected.message,
            `Message ошибки не соответствует ожидаемому`
          );
        });
      }

      if (notifications.length > 0) {
        notifications.forEach(({ type, message, description }, i) => {
          const call = notification[type].getCall(i);
          const currentArgs = call.args[0] || {};
          const currentExpected = notifications[i];

          expect(currentArgs.message).to.equal(
            currentExpected.message,
            `Сообщение нотификации не соответствует ожидаемому`
          );
          expect(currentArgs.description).to.equal(
            currentExpected.description,
            `Описание нотификации не соответствует ожидаемому`
          );
        });
      }
    });
  };
}
