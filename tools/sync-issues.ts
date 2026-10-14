#!/usr/bin/env node

/**
 * sync-issues.ts
 *
 * Synchronizes stories from specs/epics/ to GitHub Issues.
 *
 * Usage:
 *   pnpm sync:issues [--dry-run]
 *
 * This script:
 * 1. Reads story files from specs/epics/
 * 2. Creates or updates GitHub Issues
 * 3. Links issues to the GitHub Project
 */

import * as fs from 'fs';
import * as path from 'path';

const EPICS_DIR = path.join(__dirname, '..', 'specs', 'epics');
const DRY_RUN = process.argv.includes('--dry-run');

interface Story {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  labels: string[];
  milestone?: string;
}

function parseStoryFile(filePath: string): Story | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    // Simple parser - in production, use a YAML parser
    const title = lines.find((l) => l.startsWith('# '))?.replace('# ', '') || '';
    const id = path.basename(filePath, '.md');

    return {
      id,
      title,
      description: content,
      acceptanceCriteria: [],
      labels: ['story'],
    };
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error);
    return null;
  }
}

function getStories(): Story[] {
  if (!fs.existsSync(EPICS_DIR)) {
    console.log('No epics directory found');
    return [];
  }

  const files = fs.readdirSync(EPICS_DIR).filter((f) => f.endsWith('.md') && f.startsWith('e'));

  return files
    .map((f) => parseStoryFile(path.join(EPICS_DIR, f)))
    .filter((s): s is Story => s !== null);
}

async function syncIssues() {
  console.log('Syncing issues...');

  if (DRY_RUN) {
    console.log('DRY RUN - no changes will be made');
  }

  const stories = getStories();
  console.log(`Found ${stories.length} stories`);

  for (const story of stories) {
    console.log(`- ${story.id}: ${story.title}`);

    if (!DRY_RUN) {
      // TODO: Create or update GitHub Issue
      // This requires GitHub API authentication
      console.log(`  Would create/update issue: ${story.title}`);
    }
  }

  console.log('Sync complete');
}

syncIssues().catch(console.error);
