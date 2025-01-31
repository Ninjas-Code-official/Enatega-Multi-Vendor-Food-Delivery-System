// Core
import { useState } from 'react';

// Components
import RiderAddForm from '@/lib/ui/screen-components/protected/super-admin/riders/add-form';
import RiderHeader from '@/lib/ui/screen-components/protected/super-admin/riders/view/header/screen-header';
import RidersMain from '@/lib/ui/screen-components/protected/super-admin/riders/view/main';

// Interfaces and Types
import { IRiderResponse } from '@/lib/utils/interfaces/rider.interface';

export default function RidersScreen() {
  // State
  const [isAddRiderVisible, setIsAddRiderVisible] = useState(false);
  const [rider, setRider] = useState<null | IRiderResponse>(null);

  return (
    <div className="screen-container">
      <RiderHeader setIsAddRiderVisible={setIsAddRiderVisible} />

      <RidersMain
        setIsAddRiderVisible={setIsAddRiderVisible}
        setRider={setRider}
      />

      <RiderAddForm
        rider={rider}
        onHide={() => {
          setIsAddRiderVisible(false);
          setRider(null);
        }}
        isAddRiderVisible={isAddRiderVisible}
      />
    </div>
  );
}
