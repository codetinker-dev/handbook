import React from 'react';
import ColorModeToggle from '@theme-original/ColorModeToggle';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {signOut} from '../auth';

export default function ColorModeToggleWrapper(props) {
  const {siteConfig} = useDocusaurusContext();
  const apiUrl = siteConfig.customFields?.backendApiUrl as string;

  const handleLogout = async () => {
    await signOut(apiUrl);
    window.location.reload();
  };

  return (
    <>
      <button
        type="button"
        style={{marginRight: 15, cursor: 'pointer', color: '#222222'}}
        onClick={handleLogout}
      >
        Logout
      </button>
      <ColorModeToggle {...props} />
    </>
  );
}
