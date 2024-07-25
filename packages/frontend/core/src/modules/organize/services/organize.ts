import { LiveData, Service } from '@toeverything/infra';
import { map } from 'rxjs';

import { FolderNode } from '../entities/folder-node';
import type { FolderStore } from '../stores/folder';

export class OrganizeService extends Service {
  readonly rootFolder = this.framework.createEntity(FolderNode, {
    id: null,
  });

  constructor(private readonly folderStore: FolderStore) {
    super();
  }

  // get folder by id
  folderNode$(id: string) {
    return LiveData.from(
      this.folderStore.watchNodeInfo(id).pipe(
        map(info => {
          if (!info) {
            return null;
          }
          return this.framework.createEntity(FolderNode, {
            id,
          });
        })
      ),
      null
    );
  }
}
