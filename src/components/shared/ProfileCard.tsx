import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card } from './Card';

interface ProfileCardProps {
  name: string;
  avatarUrl?: string;
  membershipLevel?: string; // ex: "Ghost Society — Gold"
  ordersCount?: number;
}

export function ProfileCard({ name, avatarUrl, membershipLevel, ordersCount }: ProfileCardProps) {
  return (
    <Card hoverable={false} className="flex items-center gap-4">
      <Avatar src={avatarUrl} name={name} size="lg" />
      <div className="flex-1">
        <p className="text-h4 text-foreground">{name}</p>
        {membershipLevel && (
          <div className="mt-1">
            <Badge tone="primary">{membershipLevel}</Badge>
          </div>
        )}
      </div>
      {ordersCount !== undefined && (
        <div className="text-right">
          <p className="font-mono text-h4 text-foreground">{ordersCount}</p>
          <p className="text-caption text-muted">pedidos</p>
        </div>
      )}
    </Card>
  );
}
