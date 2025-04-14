/*
  This script helps identify all documentation pages that need to be updated
  to use the new DocumentationLayout component for consistent navigation.
  
  Run this script to get a list of files that might need updating:
  
  $ node update-doc-navigation.js
*/

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docsDir = path.join(__dirname, 'app', 'docs');

// Get all documentation pages
function findAllDocPages(dir) {
  try {
    const results = [];
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
      const filePath = path.join(dir, file.name);
      
      if (file.isDirectory()) {
        // Recurse into subdirectories
        results.push(...findAllDocPages(filePath));
      } else if (file.name === 'page.tsx') {
        // Check if the file already uses the DocumentationLayout
        const content = fs.readFileSync(filePath, 'utf8');
        const hasDocLayout = content.includes('DocumentationLayout');
        
        results.push({
          path: filePath,
          hasDocLayout,
          section: getSectionFromPath(filePath)
        });
      }
    }
    
    return results;
  } catch (error) {
    console.error(`Error scanning docs directory: ${error.message}`);
    return [];
  }
}

// Determine the section from the file path
function getSectionFromPath(filePath) {
  // Extract the relative path inside the docs directory
  const relativePath = path.relative(docsDir, filePath);
  const parts = relativePath.split(path.sep);
  
  if (parts.length === 1) {
    // Files directly in docs folder
    return 'index';
  } else if (parts.length === 2) {
    // Main sections like /docs/getting-started
    return parts[0];
  } else {
    // Subsections like /docs/events/communications
    return {
      parent: parts[0],
      child: parts[1]
    };
  }
}

// Main function
function main() {
  console.log('Scanning documentation pages...\n');
  
  const docPages = findAllDocPages(docsDir);
  
  console.log(`Found ${docPages.length} documentation pages.`);
  console.log('');
  
  const updatedPages = docPages.filter(page => page.hasDocLayout);
  const pagesNeedingUpdate = docPages.filter(page => !page.hasDocLayout);
  
  console.log(`✅ ${updatedPages.length} pages already using the new DocumentationLayout:`);
  updatedPages.forEach(page => {
    console.log(`  - ${path.relative(__dirname, page.path)}`);
  });
  
  console.log('');
  console.log(`❌ ${pagesNeedingUpdate.length} pages still need to be updated:`);
  pagesNeedingUpdate.forEach(page => {
    const section = typeof page.section === 'string' ? page.section : `${page.section.parent}/${page.section.child}`;
    console.log(`  - ${path.relative(__dirname, page.path)} (section: ${section})`);
  });
  
  console.log('\nTo update a page, modify it to use the DocumentationLayout component:');
  console.log(`
\`\`\`jsx
import { DocumentationLayout } from '@/components/documentation-layout';

export default function PageName() {
  return (
    <DocumentationLayout 
      section="section-name" 
      title="Page Title"
      isSubSection={false} // Set to true for nested pages
      parentSection="" // Set parent section for nested pages
    >
      {/* Page content */}
    </DocumentationLayout>
  );
}
\`\`\`
  `);
}

main(); 