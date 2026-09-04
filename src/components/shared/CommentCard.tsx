import { Avatar } from '@/components/ui/Avatar';
import { Card } from './Card';

interface CommentCardProps {
  authorName: string;
  authorAvatarUrl?: string;
  content: string;
  createdAt: string; // já formatado (ex: "há 2 dias") — formatação de data é responsabilidade de quem chama
}

export function CommentCard({ authorName, authorAvatarUrl, content, createdAt }: CommentCardProps) {
  return (
    <Card hoverable={false} className="flex gap-4">
      <Avatar src={authorAvatarUrl} name={authorName} size="sm" />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-body-sm text-foreground">{authorName}</p>
          <span className="text-caption text-muted">{createdAt}</span>
        </div>
        <p className="mt-1 text-body-sm text-muted">{content}</p>
      </div>
    </Card>
  );
}
