import React, { useEffect } from 'react';

const OAuthCallback = () => {
  useEffect(() => {
    console.log('OAuthCallback');
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code && window.opener) {
      window.opener.postMessage({ type: 'oauth-code', code }, window.origin);
      window.close();
    }
  }, []);

  return <p>Logging in...</p>;
};

export default OAuthCallback;
