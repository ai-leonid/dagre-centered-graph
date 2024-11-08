import React, {useState} from 'react';
import '@xyflow/react/dist/style.css';
import {PageDagreStaticHeight} from './PageDagreStaticHeight.jsx';
import {PageDagreDynamicHeight} from './PageDagreDynamicHeight.jsx';

export default function App() {
  const [viewType, setViewType] = useState('dynamic');

  return (
      <>
        <div>
          <button onClick={() => setViewType('static')}>Static</button>
          <button onClick={() => setViewType('dynamic')}>Dynamic</button>
        </div>
        {viewType === 'static' && <PageDagreStaticHeight/>}
        {viewType === 'dynamic' && <PageDagreDynamicHeight/>}
      </>
  );
}