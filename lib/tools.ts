import { Ast } from '@/components/ast';
import { CodePath } from '@/components/path';
import { Scope } from '@/components/scope';
import { Wrap } from '@/components/wrap';
import { AstViewMode } from '@/components/ast-view-mode';
import { ScopeViewMode } from '@/components/scope-view-mode';

export const tools = [
  {
    href: '/',
    name: 'AST',
    value: 'ast',
    component: Ast,
    options: [Wrap, AstViewMode],
  },
  {
    href: '/scope',
    name: 'Scope',
    value: 'scope',
    component: Scope,
    options: [Wrap, ScopeViewMode],
  },
  {
    href: '/path',
    name: 'Code Path',
    value: 'codepath',
    component: CodePath,
    options: [Wrap],
  },
];
