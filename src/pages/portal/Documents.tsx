import { useState } from 'react';
import {
  FileText,
  Download,
  Eye,
  Search
} from 'lucide-react';
import { useDemo } from '../../state/DemoProvider';
import type { DemoDocument, DocCategory } from '../../state/types';
import { PageHeader, StatusBadge } from '../../components/ui/Feedback';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Dialog';
import { formatShortDate } from '../../lib/dates';
import { buildPdf, downloadBlob } from '../../lib/pdf';
import { useToast } from '../../components/ui/Toast';

const CATEGORIES: ('All' | DocCategory)[] = [
  'All',
  'Getting Started',
  'Service Agreements',
  'Planning Resources',
  'Invoices',
  'Shared Documents'
];

export default function Documents() {
  const { state } = useDemo();
  const { toast } = useToast();

  const [activeCategory, setActiveCategory] = useState<'All' | DocCategory>('All');
  const [search, setSearch] = useState('');
  const [previewDoc, setPreviewDoc] = useState<DemoDocument | null>(null);

  const handleDownloadDoc = (doc: DemoDocument) => {
    const blocks = doc.sections.flatMap((s) => [
      { kind: 'h' as const, text: s.heading },
      { kind: 'p' as const, text: s.body }
    ]);
    const blob = buildPdf(doc.title, blocks);
    downloadBlob(blob, doc.filename);
    toast({
      tone: 'success',
      title: 'File Downloaded',
      message: `Downloaded local copy of ${doc.filename}.`
    });
  };

  const filteredDocs = state.documents.filter((d) => {
    const matchesCat = activeCategory === 'All' || d.category === activeCategory;
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="portal-page-container">
      <PageHeader
        eyebrow="Document Library"
        title="Resources & Documents"
        description="Access guides, planning resources, agreements, receipts, and coordination checklists."
      />

      {/* Filter and Search Bar */}
      <div className="doc-filter-bar row row--between row--wrap" style={{ gap: '16px', marginBottom: '24px' }}>
        <div className="seg" role="tablist">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="doc-search-box">
          <Search size={16} className="doc-search-icon" />
          <input
            type="text"
            className="input doc-search-input"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Documents Grid */}
      <div className="docs-grid">
        {filteredDocs.map((doc) => (
          <div key={doc.id} className="card doc-card">
            <div className="card__head">
              <span className="doc-card-icon">
                <FileText size={22} />
              </span>
              <StatusBadge tone="neutral">{doc.category}</StatusBadge>
            </div>

            <h2 className="doc-card-title">{doc.title}</h2>
            <p className="small muted doc-card-desc">{doc.description}</p>

            <div className="doc-card-meta row row--between small muted">
              <span>{doc.size}</span>
              <span>Added {formatShortDate(doc.added)}</span>
            </div>

            <div className="doc-card-actions row" style={{ gap: '8px', marginTop: '20px' }}>
              <Button
                variant="secondary"
                size="sm"
                block
                onClick={() => setPreviewDoc(doc)}
                icon={<Eye size={14} />}
              >
                Preview
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownloadDoc(doc)}
                title="Download PDF"
                icon={<Download size={14} />}
              >
                PDF
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Document In-App Preview Modal */}
      {previewDoc && (
        <Modal
          open={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          title={previewDoc.title}
          description={`${previewDoc.category} · ${previewDoc.filename} (${previewDoc.size})`}
          size="lg"
          footer={
            <>
              <Button
                variant="secondary"
                icon={<Download size={15} />}
                onClick={() => handleDownloadDoc(previewDoc)}
              >
                Download PDF
              </Button>
              <Button onClick={() => setPreviewDoc(null)}>
                Close Preview
              </Button>
            </>
          }
        >
          <div className="doc-preview-body stack" style={{ gap: '20px' }}>
            <div className="agreement-doc-paper" style={{ padding: '24px' }}>
              <div className="doc-watermark">Havenwell Resource</div>
              {previewDoc.sections.map((sec) => (
                <div key={sec.heading} className="doc-section">
                  <h3 className="doc-sec-heading">{sec.heading}</h3>
                  <p className="doc-sec-body">{sec.body}</p>
                </div>
              ))}
            </div>

            <p className="small muted" style={{ textAlign: 'center' }}>
              All documents in this library are simulated demo resources generated locally in your browser.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
