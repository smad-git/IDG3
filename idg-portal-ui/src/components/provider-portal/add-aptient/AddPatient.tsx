import { PropsWithChildren } from 'react';
import { ChildrenProps } from '../../../types/CommonTypes';

export const AddPatient: React.FC<
  PropsWithChildren<ChildrenProps>
> = () => {
  return (
    <>
      <p>This is the scrollable body content.</p>
      {/* Add more content here to make it scrollable */}
    </>
  );
};
