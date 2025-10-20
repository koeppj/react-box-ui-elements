import React, { useEffect } from 'react';
import APICache from 'box-ui-elements/es/utils/Cache';
import type { BoxItem, Collection, Token } from 'box-ui-elements/es/common/types/core';
import { Item } from '@box/types';
import Modal from 'react-modal';

export interface ModalPreviewProps {
    token: String
    item: Item
    parentElement: HTMLElement;
    appElement: HTMLElement;
    isOpen: boolean;
}

export function ModalPreview(
    token: string,
    item: Item,
    parentElement: HTMLElement,
    appElement: HTMLElement,
    isOpen: boolean,
) {

    return (
      <Modal
            appElement={appElement}
            className={CLASS_MODAL_CONTENT_FULL_BLEED}
            contentLabel={formatMessage(messages.preview)}
            isOpen={isOpen}
            onRequestClose={onCancel}
            overlayClassName={CLASS_MODAL_OVERLAY}
            parentSelector={() => parentElement}
            portalClassName={CLASS_MODAL}
        >
            <p>Preview Modal</p>
        </Modal>
    );
}
