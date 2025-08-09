
import React from 'react';
import { usePrograms } from '../../hooks/useCMS';

const ProgramsList: React.FC = () => {
  const { programs, loading, error } = usePrograms();
  
  // Debug: Log the data we're receiving
  console.log('Programs data:', programs);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Loading programs from CMS...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <strong>CMS Connection Error:</strong> {error}
        <div className="mt-2 text-sm">
          Make sure Strapi is running on http://localhost:1337 and the Programs content type has public permissions.
        </div>
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
        <strong>No Programs Found:</strong> 
        <div className="mt-2 text-sm">
          Go to your Strapi admin panel and create some program entries to see them here.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Programs from CMS</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {programs.map((program) => {
          // Helper function to convert rich text blocks to plain text
          const convertRichTextToString = (richText: any): string => {
            if (!richText || !Array.isArray(richText)) return '';
            
            return richText.map((block: any) => {
              if (block.type === 'paragraph' && block.children) {
                return block.children.map((child: any) => child.text || '').join('');
              }
              return '';
            }).join('\n');
          };
          
          return (
            <div 
              key={program.id} 
              className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Hero Image */}
              {program.heroImage && (
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={`http://localhost:1337${program.heroImage.url}`}
                    alt={program.heroImage.alternativeText || program.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-4">
                {/* Program Type Badge */}
                {program.programType && (
                  <div className="mb-2">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {program.programType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                )}
                
                <h3 className="text-lg font-semibold mb-2">
                  {program.title || 'Untitled Program'}
                </h3>
                
                {/* Short Description */}
                {program.shortDescription && (
                  <p className="text-gray-600 text-sm mb-3">
                    {program.shortDescription}
                  </p>
                )}
                
                {/* Full Description (from rich text blocks) */}
                {program.description && (
                  <div className="text-gray-500 text-xs mb-3">
                    <details>
                      <summary className="cursor-pointer hover:text-gray-700">
                        Read more...
                      </summary>
                      <div className="mt-2 text-sm whitespace-pre-line">
                        {convertRichTextToString(program.description)}
                      </div>
                    </details>
                  </div>
                )}
                
                <div className="text-xs text-gray-400">
                  ID: {program.id} | Slug: {program.slug || 'N/A'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
        <div className="text-sm text-green-700">
          ✅ <strong>CMS Integration Working!</strong> 
          <br />
          Showing {programs.length} program(s) from Strapi CMS
        </div>
      </div>
    </div>
  );
};

export default ProgramsList;
