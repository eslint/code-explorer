import type { FC } from 'react';

const Home: FC = () => (
  <div className="grid grid-cols-2 divide-x h-full">
    <div>
      <p>Editor</p>
    </div>
    <div className="bg-secondary">
      <p>Output</p>
    </div>
  </div>
);

export default Home;
