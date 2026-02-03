/**
 * Component Library
 *
 * Atomic Design component system.
 * - Atoms: smallest building blocks (Text, Icon, Spacer, etc.)
 * - Molecules: combinations of atoms (Button, TextField, etc.)
 * - Organisms: complex UI sections (HeaderBar, ModalSheet, etc.)
 * - Templates: page layouts (AppShell, FlowShell, etc.)
 */

// Atoms
export * from './atoms';

// Molecules
export * from './molecules';

// Organisms
export * from './organisms';

// Templates
export * from './templates';

// World (legacy, kept for backwards compatibility)
export { WorldScene, WorldLayer } from './world';
