#!/usr/bin/env node

/**
 * ready-stories.ts
 *
 * Lists stories that are ready to be worked on in parallel.
 *
 * A story is ready when:
 * 1. Its dependencies are completed
 * 2. Its touches don't overlap with in-progress stories
 * 3. No more than 2 stories are in progress
 * 4. No more than 1 story with migrations is in progress
 *
 * Usage:
 *   pnpm ready:stories
 */

import * as fs from 'fs';
import * as path from 'path';

const EPICS_DIR = path.join(__dirname, '..', 'specs', 'epics');
const EXECUTION_STATUS = path.join(__dirname, '..', 'specs', 'execution-status.yaml');

interface Story {
  id: string;
  title: string;
  touches: string[];
  dependsOn: string[];
  migrations: boolean;
  status: 'pending' | 'in_progress' | 'completed';
}

function parseStoryFile(filePath: string): Story | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    const title = lines.find((l) => l.startsWith('# '))?.replace('# ', '') || '';
    const id = path.basename(filePath, '.md');

    // Parse touches, depends_on, migrations from YAML frontmatter or content
    const touches: string[] = [];
    const dependsOn: string[] = [];
    let migrations = false;

    // Simple parsing - in production, use a YAML parser
    for (const line of lines) {
      if (line.includes('touches:')) {
        const match = line.match(/touches:\s*\[(.*?)\]/);
        if (match) {
          touches.push(...match[1].split(',').map((s) => s.trim()));
        }
      }
      if (line.includes('depends_on:')) {
        const match = line.match(/depends_on:\s*\[(.*?)\]/);
        if (match) {
          dependsOn.push(...match[1].split(',').map((s) => s.trim()));
        }
      }
      if (line.includes('migrations:')) {
        migrations = line.includes('true');
      }
    }

    return {
      id,
      title,
      touches,
      dependsOn,
      migrations,
      status: 'pending',
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

function getExecutionStatus(): Record<string, string> {
  if (!fs.existsSync(EXECUTION_STATUS)) {
    return {};
  }

  const content = fs.readFileSync(EXECUTION_STATUS, 'utf-8');
  const status: Record<string, string> = {};

  // Simple parsing - in production, use a YAML parser
  for (const line of content.split('\n')) {
    const match = line.match(/^(\w+):\s*(\w+)$/);
    if (match) {
      status[match[1]] = match[2];
    }
  }

  return status;
}

function isReady(story: Story, allStories: Story[], status: Record<string, string>): boolean {
  // Check if already completed
  if (status[story.id] === 'completed') {
    return false;
  }

  // Check if dependencies are completed
  for (const dep of story.dependsOn) {
    if (status[dep] !== 'completed') {
      return false;
    }
  }

  return true;
}

function getReadyStories() {
  const stories = getStories();
  const status = getExecutionStatus();

  const inProgress = stories.filter((s) => status[s.id] === 'in_progress');
  const ready = stories.filter((s) => isReady(s, stories, status));

  // Filter out stories that overlap with in-progress stories
  const available = ready.filter((story) => {
    // Check WIP limit
    if (inProgress.length >= 2) {
      return false;
    }

    // Check migration limit
    if (story.migrations && inProgress.some((s) => s.migrations)) {
      return false;
    }

    // Check touches overlap
    for (const inProgressStory of inProgress) {
      const overlap = story.touches.some((t) => inProgressStory.touches.includes(t));
      if (overlap) {
        return false;
      }
    }

    return true;
  });

  return {
    ready: available,
    inProgress,
    blocked: stories.filter((s) => !isReady(s, stories, status) && status[s.id] !== 'completed'),
  };
}

function main() {
  const { ready, inProgress, blocked } = getReadyStories();

  console.log('Ready Stories:');
  if (ready.length === 0) {
    console.log('  (none)');
  } else {
    for (const story of ready) {
      console.log(`  - ${story.id}: ${story.title}`);
      if (story.touches.length > 0) {
        console.log(`    Touches: ${story.touches.join(', ')}`);
      }
      if (story.migrations) {
        console.log(`    Has migrations`);
      }
    }
  }

  console.log('\nIn Progress:');
  if (inProgress.length === 0) {
    console.log('  (none)');
  } else {
    for (const story of inProgress) {
      console.log(`  - ${story.id}: ${story.title}`);
    }
  }

  console.log('\nBlocked:');
  if (blocked.length === 0) {
    console.log('  (none)');
  } else {
    for (const story of blocked) {
      console.log(`  - ${story.id}: ${story.title}`);
      console.log(`    Dependencies: ${story.dependsOn.join(', ') || 'none'}`);
    }
  }
}

main();
