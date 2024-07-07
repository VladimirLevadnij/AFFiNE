import { IconButton, Loading, observeResize } from '@affine/component';
import { useAsyncCallback } from '@affine/core/hooks/affine-async-hooks';
import { DesktopStateSynchronizer } from '@affine/core/modules/workbench/services/desktop-state-synchronizer';
import type { TabViewsMetaSchema, WorkbenchMeta } from '@affine/electron-api';
import { apis, TabViewsMetaKey } from '@affine/electron-api';
import {
  CloseIcon,
  DeleteIcon,
  EdgelessIcon,
  FolderIcon,
  PageIcon,
  PlusIcon,
  RightSidebarIcon,
  TagIcon,
  TodayIcon,
  ViewLayersIcon,
} from '@blocksuite/icons/rc';
import { useGlobalStateValue, useServiceOptional } from '@toeverything/infra';
import { debounce, partition } from 'lodash-es';
import {
  Fragment,
  type MouseEventHandler,
  type ReactNode,
  useEffect,
  useRef,
} from 'react';

import { WindowsAppControls } from '../pure/header/windows-app-controls';
import * as styles from './app-tabs.css';

type ModuleName = NonNullable<WorkbenchMeta['views'][0]['moduleName']>;

const moduleNameToIcon = {
  all: <FolderIcon />,
  collection: <ViewLayersIcon />,
  doc: <PageIcon />,
  page: <PageIcon />,
  edgeless: <EdgelessIcon />,
  journal: <TodayIcon />,
  tag: <TagIcon />,
  trash: <DeleteIcon />,
} satisfies Record<ModuleName, ReactNode>;

const WorkbenchTab = ({
  workbench,
  active: tabActive,
  tabsLength,
}: {
  workbench: TabViewsMetaSchema['workbenches'][0];
  active: boolean;
  tabsLength: number;
}) => {
  const activeViewIndex = workbench.activeViewIndex ?? 0;
  const onContextMenu = useAsyncCallback(
    async (viewIdx: number) => {
      await apis?.ui.showTabContextMenu(workbench.id, viewIdx);
    },
    [workbench.id]
  );
  const onActivateView = useAsyncCallback(
    async (viewIdx: number) => {
      await apis?.ui.activateView(workbench.id, viewIdx);
    },
    [workbench.id]
  );
  const onCloseTab: MouseEventHandler = useAsyncCallback(
    async e => {
      e.stopPropagation();

      await apis?.ui.closeTab(workbench.id);
    },
    [workbench.id]
  );

  return (
    <div
      key={workbench.id}
      data-active={tabActive}
      data-pinned={workbench.pinned}
      className={styles.tab}
    >
      {workbench.views.map((view, viewIdx) => {
        return (
          <Fragment key={view.id}>
            <button
              key={view.id}
              className={styles.splitViewLabel}
              data-active={activeViewIndex === viewIdx && tabActive}
              onContextMenu={() => {
                onContextMenu(viewIdx);
              }}
              onClick={e => {
                e.stopPropagation();
                onActivateView(viewIdx);
              }}
            >
              <div className={styles.labelIcon}>
                {view.moduleName ? (
                  moduleNameToIcon[view.moduleName]
                ) : (
                  <Loading />
                )}
              </div>
              {workbench.pinned || !view.title ? null : (
                <div title={view.title} className={styles.splitViewLabelText}>
                  {view.title}
                </div>
              )}
            </button>

            {viewIdx !== workbench.views.length - 1 ? (
              <div className={styles.splitViewSeparator} />
            ) : null}
          </Fragment>
        );
      })}
      {!workbench.pinned && tabsLength > 1 ? (
        <div className={styles.tabCloseButtonWrapper}>
          <button className={styles.tabCloseButton} onClick={onCloseTab}>
            <CloseIcon />
          </button>
        </div>
      ) : null}
    </div>
  );
};

export const AppTabs = ({
  style,
  reportBoundingUpdate,
}: {
  style?: React.CSSProperties;
  reportBoundingUpdate?: boolean;
}) => {
  const tabViewsMeta = useGlobalStateValue<TabViewsMetaSchema>(
    TabViewsMetaKey,
    {
      workbenches: [],
      activeWorkbenchId: '',
    }
  );
  const activeWorkbench = tabViewsMeta.workbenches.find(
    workbench => workbench.id === tabViewsMeta.activeWorkbenchId
  );
  const activeView =
    activeWorkbench?.views[activeWorkbench.activeViewIndex ?? 0];

  const [pinned, unpinned] = partition(
    tabViewsMeta.workbenches,
    workbench => workbench.pinned
  );

  const onAddTab = useAsyncCallback(async () => {
    if (activeView && activeWorkbench) {
      await apis?.ui.addTab();
    }
  }, [activeView, activeWorkbench]);

  const onToggleRightSidebar = useAsyncCallback(async () => {
    await apis?.ui.toggleRightSidebar();
  }, []);

  const ref = useRef<HTMLDivElement | null>(null);

  useServiceOptional(DesktopStateSynchronizer);

  useEffect(() => {
    if (ref.current && reportBoundingUpdate) {
      return observeResize(
        ref.current,
        debounce(() => {
          if (document.visibilityState === 'visible') {
            const rect = ref.current?.getBoundingClientRect();
            if (!rect) {
              return;
            }
            const toInt = (value: number) => Math.round(value);
            const boundRect = {
              height: toInt(rect.height),
              width: toInt(rect.width),
              x: toInt(rect.x),
              y: toInt(rect.y),
            };
            apis?.ui.updateTabsBoundingRect(boundRect).catch(console.error);
          }
        }, 50)
      );
    }
    return;
  }, [reportBoundingUpdate]);

  return (
    <div className={styles.root} ref={ref} style={style}>
      <div className={styles.tabs}>
        {pinned.map(workbench => {
          const tabActive = workbench.id === tabViewsMeta.activeWorkbenchId;
          return (
            <WorkbenchTab
              tabsLength={pinned.length}
              key={workbench.id}
              workbench={workbench}
              active={tabActive}
            />
          );
        })}
        {pinned.length > 0 && unpinned.length > 0 && (
          <div className={styles.pinSeparator} />
        )}
        {unpinned.map(workbench => {
          const tabActive = workbench.id === tabViewsMeta.activeWorkbenchId;
          return (
            <WorkbenchTab
              tabsLength={tabViewsMeta.workbenches.length}
              key={workbench.id}
              workbench={workbench}
              active={tabActive}
            />
          );
        })}
        <IconButton onClick={onAddTab}>
          <PlusIcon />
        </IconButton>
      </div>
      <div className={styles.spacer} />
      <IconButton size="large" onClick={onToggleRightSidebar}>
        <RightSidebarIcon />
      </IconButton>
      {environment.isDesktop && environment.isWindows ? (
        <WindowsAppControls />
      ) : (
        <div style={{ width: 8 }} />
      )}
    </div>
  );
};
