import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export function ContactPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // placeholder for future submission logic
    alert(`Submitted:\nTitle: ${title}\nDescription: ${description}`);
    setTitle('');
    setDescription('');
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="mb-6 flex items-center gap-2">
        <Mail className="h-6 w-6 text-indigo-500" />
        <h2 className="text-xl font-semibold text-gray-900">Contact Us</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="contact-title">
            Title
          </label>
          <Input
            id="contact-title"
            placeholder="Enter a subject"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="contact-description">
            Description
          </label>
          <Textarea
            id="contact-description"
            placeholder="Describe your message..."
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <Button type="submit" disabled={!title.trim() || !description.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
}
