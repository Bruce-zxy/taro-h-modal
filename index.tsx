import React, { useState, useImperativeHandle} from 'react';
import { Text } from '@tarojs/components';
import { AtModal, AtModalContent, AtModalAction } from 'taro-ui';

import {stateHandler} from '@/utils';

import './index.less';

const commonModalRef = React.createRef();

interface IModalOptions {
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}

const initialState = {
  showFlag: false,
  content: '',
  cancelText: '',
  confirmText: '',
  onCancel: () => { },
  onConfirm: () => { },
}

export const HModal = () => {
  const [state, setState] = useState(initialState);
  const toSetState = stateHandler(setState);
  useImperativeHandle(
    commonModalRef,
    () => ({
      show: (content: string, initOptions?: IModalOptions) => {
        toSetState(prevState => {
          const cancelText = initOptions?.cancelText ?? prevState.cancelText;
          const confirmText = initOptions?.confirmText ?? prevState.confirmText;
          const onCancel = initOptions?.onCancel ?? prevState.onCancel;
          const onConfirm = initOptions?.onConfirm ?? prevState.onConfirm;
          return {
            showFlag: !!content,
            content: content,
            cancelText,
            confirmText,
            onCancel,
            onConfirm,
          }
        })
      },
      hide: closeHandler,
    }),
  );

  const cancelHandler = () => {
    state.onCancel();
    closeHandler();
  }
  const confirmHandler = () => {
    state.onConfirm();
    closeHandler();
  }
  const closeHandler = () => {
    toSetState({showFlag: false});
    setTimeout(() => {
      toSetState(initialState);
    }, 500);
  }

  return (
    <AtModal isOpened={state.showFlag}>
      <AtModalContent>
        <Text className='jlkj-common-modal-content'>{state.content}</Text>
      </AtModalContent>
      <AtModalAction>
        {state.cancelText ? <Text className='jlkj-common-modal-cancel' onClick={cancelHandler}>{state.cancelText}</Text> : null}
        {state.confirmText ? <Text className='jlkj-common-modal-confirm' onClick={confirmHandler}>{state.confirmText}</Text> : null}
        {!state.cancelText && !state.confirmText ? <Text className='jlkj-common-modal-confirm' onClick={() => toSetState({ showFlag: false })}>确定</Text> : null}
      </AtModalAction>
    </AtModal>
  )
};

export default {
  show: function (content: string, initOptions?: IModalOptions) {
    commonModalRef.current?.show(content, initOptions);
  },
  hide: function () {
    commonModalRef.current?.hide();
  }
}
