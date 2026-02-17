/**
 * DocumentationViewer - Multi-file documentation viewer with tree navigation
 * 
 * Features:
 * - Tree-view sidebar for file navigation
 * - Markdown rendering with Mermaid diagram support
 * - Collapsible folders
 * - Search/filter files
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronDown,
  FileText,
  Folder,
  FolderOpen,
  Search,
  ExternalLink,
  Copy,
  Check,
  BookOpen,
  List,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Card, Button, Skeleton } from '@shared/components/ui';
import { api } from '@shared/lib/api';
import type { DocumentationFile } from '@shared/types';
import { cn } from '@shared/lib/utils';

// =============================================
// Types
// =============================================

interface TreeNode {
  name: string;
  path: string;
  isFolder: boolean;
  children: TreeNode[];
  url?: string;
  size?: number;
}

interface DocumentationViewerProps {
  jobId: string;
  files?: DocumentationFile[];
  className?: string;
}

// =============================================
// Helper Functions
// =============================================

/**
 * Build a tree structure from flat file paths
 */
function buildFileTree(files: DocumentationFile[]): TreeNode[] {
  const root: TreeNode[] = [];

  for (const file of files) {
    const parts = file.path.split('/');
    let currentLevel = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      const currentPath = parts.slice(0, i + 1).join('/');

      let existing = currentLevel.find(n => n.name === part);

      if (!existing) {
        existing = {
          name: part,
          path: currentPath,
          isFolder: !isLast,
          children: [],
          url: isLast ? file.url : undefined,
          size: isLast ? file.size : undefined,
        };
        currentLevel.push(existing);
      }

      if (!isLast) {
        currentLevel = existing.children;
      }
    }
  }

  // Sort: folders first, then alphabetically
  const sortNodes = (nodes: TreeNode[]): TreeNode[] => {
    return nodes
      .map(node => ({
        ...node,
        children: sortNodes(node.children),
      }))
      .sort((a, b) => {
        if (a.isFolder && !b.isFolder) return -1;
        if (!a.isFolder && b.isFolder) return 1;
        return a.name.localeCompare(b.name);
      });
  };

  return sortNodes(root);
}

/**
 * Format file size
 */
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// =============================================
// Tree Node Component
// =============================================

interface TreeNodeItemProps {
  node: TreeNode;
  level: number;
  selectedPath: string | null;
  expandedPaths: Set<string>;
  onSelect: (node: TreeNode) => void;
  onToggle: (path: string) => void;
  searchQuery: string;
}

const TreeNodeItem: React.FC<TreeNodeItemProps> = ({
  node,
  level,
  selectedPath,
  expandedPaths,
  onSelect,
  onToggle,
  searchQuery,
}) => {
  const isExpanded = expandedPaths.has(node.path);
  const isSelected = selectedPath === node.path;
  const matchesSearch = searchQuery === '' ||
    node.name.toLowerCase().includes(searchQuery.toLowerCase());

  // Check if any child matches search
  const hasMatchingChild = (n: TreeNode): boolean => {
    if (n.name.toLowerCase().includes(searchQuery.toLowerCase())) return true;
    return n.children.some(hasMatchingChild);
  };

  const showNode = searchQuery === '' || matchesSearch || hasMatchingChild(node);

  if (!showNode) return null;

  return (
    <div>
      <button
        onClick={() => node.isFolder ? onToggle(node.path) : onSelect(node)}
        className={cn(
          'w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors',
          'hover:bg-white/5',
          isSelected && !node.isFolder && 'bg-brand-primary/20 text-brand-primary',
          !isSelected && 'text-gray-300'
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {node.isFolder ? (
          <>
            <span className="text-gray-500">
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </span>
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 text-yellow-500" />
            ) : (
              <Folder className="w-4 h-4 text-yellow-500" />
            )}
          </>
        ) : (
          <>
            <span className="w-4" /> {/* Spacer */}
            <FileText className="w-4 h-4 text-blue-400" />
          </>
        )}
        <span className="truncate flex-1 text-left">{node.name}</span>
        {!node.isFolder && node.size && (
          <span className="text-xs text-gray-500">{formatSize(node.size)}</span>
        )}
      </button>

      {node.isFolder && isExpanded && (
        <div>
          {node.children.map(child => (
            <TreeNodeItem
              key={child.path}
              node={child}
              level={level + 1}
              selectedPath={selectedPath}
              expandedPaths={expandedPaths}
              onSelect={onSelect}
              onToggle={onToggle}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// =============================================
// Markdown Viewer Component
// =============================================

interface MarkdownViewerProps {
  content: string;
  fileName: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content, fileName }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple Markdown to HTML conversion (basic)
  // In production, use a proper library like react-markdown
  const renderMarkdown = (md: string): string => {
    let html = md
      // Code blocks
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-gray-900 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm text-gray-300">$2</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-800 px-1.5 py-0.5 rounded text-brand-primary text-sm">$1</code>')
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-white mt-6 mb-3">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-white mt-8 mb-4 pb-2 border-b border-gray-700">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-white mt-8 mb-4">$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-brand-primary hover:underline">$1</a>')
      // Lists
      .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc text-gray-300">$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal text-gray-300">$1</li>')
      // Blockquotes
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-brand-primary pl-4 italic text-gray-400 my-4">$1</blockquote>')
      // Horizontal rule
      .replace(/^---$/gm, '<hr class="border-gray-700 my-6" />')
      // Line breaks
      .replace(/\n\n/g, '</p><p class="text-gray-300 leading-relaxed mb-4">')
      .replace(/\n/g, '<br />');

    return `<p class="text-gray-300 leading-relaxed mb-4">${html}</p>`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-800/50">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-400" />
          <span className="font-medium text-white">{fileName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? <Check className="w-4 h-4 text-cyan-500" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div
        className="flex-1 overflow-auto p-6 prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
      />
    </div>
  );
};

// =============================================
// Main Component
// =============================================

export const DocumentationViewer: React.FC<DocumentationViewerProps> = ({
  jobId,
  files: initialFiles,
  className,
}) => {
  const [files, setFiles] = useState<DocumentationFile[]>(initialFiles || []);
  const [isLoading, setIsLoading] = useState(!initialFiles);
  const [selectedFile, setSelectedFile] = useState<TreeNode | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['docs']));
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Build tree from files
  const fileTree = useMemo(() => buildFileTree(files), [files]);

  // Load files if not provided
  useEffect(() => {
    if (initialFiles) return;

    const loadFiles = async () => {
      setIsLoading(true);
      const result = await api.docs.list(jobId);
      if (result.success && result.data) {
        setFiles(result.data.files);
      }
      setIsLoading(false);
    };

    loadFiles();
  }, [jobId, initialFiles]);

  // Load file content when selected
  useEffect(() => {
    if (!selectedFile || selectedFile.isFolder) return;

    const loadContent = async () => {
      setIsLoadingContent(true);
      const result = await api.docs.get(jobId, selectedFile.path);
      if (result.success && result.data) {
        setFileContent(result.data.content);
      }
      setIsLoadingContent(false);
    };

    loadContent();
  }, [jobId, selectedFile]);

  // Auto-expand to show selected file
  useEffect(() => {
    if (!selectedFile) return;

    const parts = selectedFile.path.split('/');
    const newExpanded = new Set(expandedPaths);

    for (let i = 1; i < parts.length; i++) {
      newExpanded.add(parts.slice(0, i).join('/'));
    }

    setExpandedPaths(newExpanded);
  }, [selectedFile]);

  const handleToggleFolder = useCallback((path: string) => {
    setExpandedPaths(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  const handleSelectFile = useCallback((node: TreeNode) => {
    if (!node.isFolder) {
      setSelectedFile(node);
    }
  }, []);

  if (isLoading) {
    return (
      <Card className={cn('p-6', className)}>
        <div className="space-y-4">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="rectangular" height={200} />
        </div>
      </Card>
    );
  }

  if (files.length === 0) {
    return (
      <Card className={cn('p-6 text-center', className)}>
        <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">No documentation files available</p>
      </Card>
    );
  }

  return (
    <div className={cn(
      'flex border border-gray-700 rounded-lg overflow-hidden bg-gray-900',
      isFullscreen && 'fixed inset-4 z-50',
      className
    )}>
      {/* Sidebar */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-r border-gray-700 flex flex-col bg-gray-800/50"
          >
            {/* Search */}
            <div className="p-3 border-b border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-300 placeholder-gray-500 focus:border-brand-primary focus:outline-none"
                />
              </div>
            </div>

            {/* File Tree */}
            <div className="flex-1 overflow-auto py-2">
              {fileTree.map(node => (
                <TreeNodeItem
                  key={node.path}
                  node={node}
                  level={0}
                  selectedPath={selectedFile?.path || null}
                  expandedPaths={expandedPaths}
                  onSelect={handleSelectFile}
                  onToggle={handleToggleFolder}
                  searchQuery={searchQuery}
                />
              ))}
            </div>

            {/* Stats */}
            <div className="p-3 border-t border-gray-700 text-xs text-gray-500">
              {files.length} files
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 bg-gray-800/30">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <List className="w-4 h-4" />
            </Button>
            {selectedFile && (
              <span className="text-sm text-gray-400 truncate">
                {selectedFile.path}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedFile?.url && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(selectedFile.url, '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {isLoadingContent ? (
            <div className="p-6 space-y-4">
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="rectangular" height={150} />
            </div>
          ) : selectedFile && fileContent ? (
            <MarkdownViewer content={fileContent} fileName={selectedFile.name} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a file to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentationViewer;
