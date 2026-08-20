import { OSProvider } from '@/os/context';
import Desktop from '@/os/Desktop';

export default function Dashboard() {
  return (
    <OSProvider>
      <Desktop />
    </OSProvider>
  );
}
