import { useState } from 'react';
import { Avatar, Button, Card, CardContent } from '@OmarZambranoDev/portfolio-ui';
import { useSocialStore } from '../../store/socialStore';

export function NewPostInput() {
  const [content, setContent] = useState('');
  const currentUser = useSocialStore((s) => s.getCurrentUser());
  const createPost = useSocialStore((s) => s.createPost);

  const handleSubmit = () => {
    if (content.trim()) {
      createPost(content.trim());
      setContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card variant="outline" className="border-earth-stone/70">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar
            src={currentUser.avatar}
            alt={currentUser.name}
            size="md"
            className="flex-shrink-0"
          />
          <div className="flex-1 flex flex-col gap-3">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What's on your mind?"
              rows={3}
              className="resize-none rounded-lg border border-earth-stone/40 p-3 text-sm text-earth-forest placeholder:text-earth-moss/60 focus:outline-none focus:border-primary/50 min-h-[80px]"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-earth-moss">
                {content.length > 0 && `${content.length} characters`}
              </span>
              <Button variant="primary" size="sm" onClick={handleSubmit} disabled={!content.trim()}>
                Post
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
