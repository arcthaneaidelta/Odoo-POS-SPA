import { useState } from 'react';
import {
  Send,
  ShieldCheck,
  Search,
  FileText
} from 'lucide-react';
import { useDemo } from '../../state/DemoProvider';
import type { Conversation } from '../../state/types';
import { PageHeader } from '../../components/ui/Feedback';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Dialog';
import { formatStamp, formatRelative } from '../../lib/dates';
import { useToast } from '../../components/ui/Toast';

export default function Messages() {
  const { state, dispatch } = useDemo();
  const { toast } = useToast();

  const [activeConvId, setActiveConvId] = useState<string>(
    state.conversations[0]?.id || 'c-concierge'
  );
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAttachmentDoc, setActiveAttachmentDoc] = useState<{ name: string; docId: string } | null>(null);

  const activeConv = state.conversations.find((c) => c.id === activeConvId) || state.conversations[0];

  const handleSelectConv = (c: Conversation) => {
    setActiveConvId(c.id);
    if (c.unread > 0) {
      dispatch({ type: 'MSG_READ', convId: c.id });
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;

    const text = inputText.trim();
    setInputText('');

    dispatch({
      type: 'MSG_SEND',
      convId: activeConv.id,
      text
    });

    toast({
      tone: 'success',
      title: 'Message Sent',
      message: 'Demo message added to local thread.'
    });

    // Optional simulated reply after brief delay
    setTimeout(() => {
      dispatch({
        type: 'MSG_RECEIVE',
        convId: activeConv.id,
        text: "Thank you for the update, Alex. I've noted this in your coordination file and will adjust your roadmap accordingly.",
        read: false
      });
    }, 2400);
  };

  const filteredConversations = state.conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="portal-page-container">
      <PageHeader
        eyebrow="Secure Communications"
        title="Concierge Messaging"
        description="Private messaging demonstration with your dedicated care coordination team."
      />

      {/* Messaging Shell */}
      <div className="messages-layout card">
        {/* Left: Conversations List */}
        <aside className="messages-sidebar">
          <div className="messages-search-wrap">
            <Search size={16} className="messages-search-icon" />
            <input
              type="text"
              className="messages-search-input"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="messages-conv-list">
            {filteredConversations.map((c) => {
              const lastMsg = c.messages.slice(-1)[0];
              const isActive = c.id === activeConv.id;

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelectConv(c)}
                  className={`messages-conv-item ${isActive ? 'is-active' : ''}`}
                >
                  <div className="portal-avatar portal-avatar--sm">
                    {c.initials}
                  </div>
                  <div className="messages-conv-meta">
                    <div className="row row--between">
                      <strong className="messages-conv-title">{c.title}</strong>
                      {lastMsg && (
                        <span className="small muted">
                          {formatRelative(lastMsg.ts)}
                        </span>
                      )}
                    </div>
                    <span className="small muted messages-conv-role">{c.role}</span>
                    {lastMsg && (
                      <p className="small muted messages-conv-snippet">
                        {lastMsg.from === 'client' ? 'You: ' : ''}
                        {lastMsg.text}
                      </p>
                    )}
                  </div>
                  {c.unread > 0 && (
                    <span className="messages-unread-dot" title={`${c.unread} unread`} />
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Center: Active Conversation Thread */}
        <div className="messages-thread">
          <header className="messages-thread-header row row--between">
            <div className="row" style={{ gap: '12px' }}>
              <div className="portal-avatar">{activeConv.initials}</div>
              <div>
                <strong>{activeConv.title}</strong>
                <span className="small muted" style={{ display: 'block' }}>
                  {activeConv.role}
                </span>
              </div>
            </div>

            <div className="callout callout--privacy small" style={{ margin: 0, padding: '6px 12px' }}>
              <ShieldCheck size={14} />
              <span>Simulated Message Sandbox</span>
            </div>
          </header>

          <div className="messages-bubbles stack">
            {activeConv.messages.map((m) => {
              const isClient = m.from === 'client';
              return (
                <div
                  key={m.id}
                  className={`msg-row ${isClient ? 'msg-row--client' : 'msg-row--team'}`}
                >
                  <div className="msg-bubble">
                    <p className="msg-text">{m.text}</p>

                    {m.attachment && (
                      <button
                        type="button"
                        className="msg-attachment-btn row"
                        onClick={() => setActiveAttachmentDoc(m.attachment!)}
                      >
                        <FileText size={14} />
                        <span>{m.attachment.name}</span>
                      </button>
                    )}

                    <time className="msg-time small">
                      {formatStamp(m.ts)}
                    </time>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Composer */}
          <form onSubmit={handleSendMessage} className="messages-composer">
            <input
              type="text"
              className="messages-input"
              placeholder={`Message ${activeConv.title}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <Button
              type="submit"
              size="sm"
              disabled={!inputText.trim()}
              icon={<Send size={15} />}
            >
              Send
            </Button>
          </form>
        </div>
      </div>

      {/* Attachment Preview Modal */}
      {activeAttachmentDoc && (
        <Modal
          open={!!activeAttachmentDoc}
          onClose={() => setActiveAttachmentDoc(null)}
          title={activeAttachmentDoc.name}
          description="Document shared through concierge messaging."
          size="md"
          footer={
            <Button onClick={() => setActiveAttachmentDoc(null)}>
              Close
            </Button>
          }
        >
          <div className="stack" style={{ gap: '16px' }}>
            <p className="small muted">
              This document was attached to your concierge conversation. You can inspect all files in the centralized Document Library.
            </p>
            <div className="card card--sage" style={{ padding: '16px' }}>
              <div className="row" style={{ gap: '10px' }}>
                <FileText size={24} className="muted" />
                <div>
                  <strong>{activeAttachmentDoc.name}</strong>
                  <span className="small muted" style={{ display: 'block' }}>PDF Document · Demo Asset</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
