import { AppTabs } from '@affine/core/components/app-tabs/app-tabs';
import { useAppSettingHelper } from '@affine/core/hooks/affine/use-app-setting-helper';
import { events } from '@affine/electron-api';
import { useEffect, useState } from 'react';

import * as styles from './shell.css';

const useIsShellActive = () => {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const unsub = events?.ui.onTabShellViewActiveChange(active => {
      setActive(active);
    });
    return () => {
      unsub?.();
    };
  });

  return active;
};

const useTabsBoundingRect = () => {
  const [rect, setRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>({
    x: environment.isDesktop && environment.isMacOs ? 80 : 0,
    y: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const unsub = events?.ui.onTabsBoundingRectChanged(rect => {
      if (rect) {
        setRect(rect);
      }
    });
    return () => {
      unsub?.();
    };
  });

  return rect;
};

export function ShellRoot() {
  const active = useIsShellActive();
  const { appSettings } = useAppSettingHelper();
  const rect = useTabsBoundingRect();
  const translucent =
    environment.isDesktop &&
    environment.isMacOs &&
    appSettings.enableBlurBackground;
  return (
    <div
      className={styles.root}
      data-translucent={translucent}
      data-active={active}
    >
      <AppTabs
        style={{
          position: 'fixed',
          top: rect.y,
          left: rect.x,
          width: rect.width,
          height: rect.height,
        }}
      />
    </div>
  );
}
