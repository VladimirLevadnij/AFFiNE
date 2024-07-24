import { SelectCollection } from '../collections';
import { SelectTag } from '../tags';
import { SelectPage } from '../view/edit-collection/select-page';
import { useSelectDialog } from './use-select-dialog';

export interface BaseSelectorDialogProps<T> {
  init?: T;
  onConfirm?: (data: T) => void;
  onCancel?: () => void;
}

/**
 * Return a `open` function to open the select collection dialog.
 */
export const useSelectCollection = () => {
  return useSelectDialog('select-collection', SelectCollection);
};

/**
 * Return a `open` function to open the select page dialog.
 */
export const useSelectDoc = () => {
  return useSelectDialog('select-doc-dialog', SelectPage);
};

/**
 * Return a `open` function to open the select tag dialog.
 */
export const useSelectTag = () => {
  return useSelectDialog('select-tag-dialog', SelectTag);
};
