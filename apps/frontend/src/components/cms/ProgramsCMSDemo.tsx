import React from 'react';
import { usePrograms } from '../../hooks/useCMS.js';
import { CMSProgram, RichTextBlock, RichTextChild, RichTextContent } from '../../services/cms.js';
import { A, H2, Section } from '../generic/styled-tags.tsx';
import Program from '../home/program.tsx';

const ProgramsCMSDemo: React.FC = () => {
  const { programs, loading, error } = usePrograms();

  // Debug: Log the programs data to see the rich text structure
  console.log('Programs with content:', programs);

  // Helper function to convert rich text blocks to React content
  const convertRichTextToReact = (richText: RichTextContent): React.ReactNode => {
    if (!richText || !Array.isArray(richText)) return '';

    console.log('Converting rich text:', richText);

    return richText
      .map((block: RichTextBlock, blockIndex: number) => {
        console.log('Processing block:', block);

        if (block.type === 'paragraph' && block.children) {
          const content = block.children.map((child: RichTextChild, childIndex: number) => {
            console.log('Processing child:', child);

            // Handle link elements (they have type: 'link' and children)
            if (child.type === 'link') {
              const linkText = child.children?.[0]?.text || '';
              const url = child.url || '#';
              return (
                <A key={childIndex} to={url}>
                  {linkText}
                </A>
              );
            }

            // Handle regular text elements
            const text = child.text || '';

            // Handle empty text (might be line break)
            if (text === '') {
              return null;
            }

            // Create the formatted text element
            let element: React.ReactNode = text;

            // Apply formatting layers
            if (child.underline) {
              element = <u>{element}</u>;
            }
            if (child.bold) {
              element = <strong>{element}</strong>;
            }
            if (child.italic) {
              element = <em>{element}</em>;
            }
            if (child.strikethrough) {
              element = <s>{element}</s>;
            }
            if (child.code) {
              element = <code>{element}</code>;
            }

            return <React.Fragment key={childIndex}>{element}</React.Fragment>;
          });

          return (
            <React.Fragment key={blockIndex}>
              {content}
              {blockIndex < richText.length - 1 && <br />}
            </React.Fragment>
          );
        }

        // Handle other block types like lists, headings, etc.
        if (block.type === 'list') {
          const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
          return (
            <ListTag key={blockIndex}>
              {block.children?.map((item: RichTextChild, itemIndex: number) => (
                <li key={itemIndex}>{item.text || ''}</li>
              ))}
            </ListTag>
          );
        }

        console.log('Unhandled block type:', block.type);
        return null;
      })
      .filter(Boolean);
  };

  if (loading) {
    return (
      <Section>
        <H2>our programs (loading...)</H2>
        <div className="flex justify-center items-center p-8">
          <div className="text-lg">Loading programs from CMS...</div>
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section>
        <H2>our programs (error)</H2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>CMS Connection Error:</strong> {error}
        </div>
      </Section>
    );
  }

  if (programs.length === 0) {
    return (
      <Section>
        <H2>our programs (no content)</H2>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <strong>No Programs Found:</strong> Create some program entries in Strapi.
        </div>
      </Section>
    );
  }

  // Sort programs by order field, fallback to creation date
  const sortedPrograms = [...programs].sort((a, b) => {
    // If both have order numbers, sort by order
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    // If only one has an order, prioritize it
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    // Fallback to alphabetical by title
    return (a.title || '').localeCompare(b.title || '');
  });

  return (
    <Section>
      <H2>our programs (from CMS)</H2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {sortedPrograms.map((program: CMSProgram) => (
          <div key={program.id} className="space-y-4">
            <Program
              title={program.title || 'Untitled Program'}
              learnMoreLink={program.learnMoreLink || '#'}
            >
              {program.content ? convertRichTextToReact(program.content) : program.shortDescription}
            </Program>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default ProgramsCMSDemo;
