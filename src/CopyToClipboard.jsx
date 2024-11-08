import React, {useCallback, useRef, useState} from 'react';


export const CopyToClipboard = ({text}) => {
  const [copySuccess, setCopySuccess] = useState('');
  const ref = useRef('');

  const handleCopy = useCallback(
      async () => {
        try {
          await navigator.clipboard.writeText(text);

          ref.current = text + ' copied!';
          setCopySuccess(text + ' copied!');
        }
        catch (err) {
          ref.current = text + ' Failed!';
          setCopySuccess('Failed to copy text.');
          console.error('Error copying text: ', err);

        }
        setTimeout(() => {
          setCopySuccess(null);
          ref.current = '';
        }, 1000);
      },
      [text],
  );

  return (
      <div style={{
        position: 'relative',
      }}>
        {copySuccess && <div style={{
          position: 'absolute',
          top: -20,
        }}>{copySuccess}</div>}

        <button style={{
          margin: 0,
          padding: '2px 8px',
          borderRadius: 5,
          border: '1px solid lightgrey',
        }} onClick={handleCopy}>{text}</button>
      </div>
  );
};
