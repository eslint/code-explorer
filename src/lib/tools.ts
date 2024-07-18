import { Ast } from '@/components/ast';
import { CodePath } from '@/components/path';
import { Scope } from '@/components/scope';
import { Wrap } from '@/components/wrap';
import { AstViewMode } from '@/components/ast/ast-view-mode';
import { ScopeViewMode } from '@/components/scope/scope-view-mode';
import { PathViewMode } from '@/components/path/path-view-mode';
import { PathIndexSelector } from '@/components/path/path-index-selector';

export const tools = [
  {
    name: 'AST',
    value: 'ast',
    component: Ast,
    options: [Wrap, AstViewMode],
  },
  {
    name: 'Scope',
    value: 'scope',
    component: Scope,
    options: [ScopeViewMode],
  },
  {
    name: 'Code Path',
    value: 'path',
    component: CodePath,
    options: [Wrap, PathViewMode, PathIndexSelector],
  },
];
