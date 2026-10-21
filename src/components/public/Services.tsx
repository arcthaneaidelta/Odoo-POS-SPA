import { CalendarDays, ClipboardList, Compass, FolderOpen, HeartHandshake, Map as MapIcon, type LucideIcon } from 'lucide-react';
import type { ServiceDef } from '../../content/site';
import { ButtonLink } from '../ui/Button';
import { Drawer } from '../ui/Dialog';

export const SERVICE_ICONS: Record<ServiceDef['icon'], LucideIcon> = {
  compass: Compass,
  map: MapIcon,
  calendar: CalendarDays,
  folder: FolderOpen,
  clipboard: ClipboardList,
  heart: HeartHandshake,
};

export function ServiceDrawer({ service, onClose }: { service: ServiceDef | null; onClose: () => void }) {
  const Icon = service ? SERVICE_ICONS[service.icon] : Compass;
  return (
    <Drawer
      open={!!service}
      onClose={onClose}
      title={service?.title ?? ''}
      size="md"
      footer={
        <>
          <ButtonLink variant="secondary" to="/how-it-works" onClick={onClose}>
            See how it works
          </ButtonLink>
          <ButtonLink to="/contact#consultation" onClick={onClose}>
            Begin With a Conversation
          </ButtonLink>
        </>
      }
    >
      {service && (
        <div className="stack">
          <span className="svc-icon svc-icon--lg">
            <Icon size={26} strokeWidth={1.5} aria-hidden="true" />
          </span>
          <p>{service.long}</p>
          <h3 style={{ fontSize: 16, marginTop: 24 }}>What this can include</h3>
          <ul className="ticks">
            {service.includes.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
          <p className="callout">
            This is a non-clinical coordination service. It does not include medical advice, diagnosis, or treatment, and it does not guarantee outcomes.
          </p>
        </div>
      )}
    </Drawer>
  );
}
