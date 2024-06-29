import ultracite from 'ultracite';

for (const config of ultracite) {
  if (config.ignores) {
    config.ignores.push('./components/ui/**/*');
  }

  if (config.rules) {
    config.rules['@typescript-eslint/ban-ts-comment'] = 'off';
    config.rules['unicorn/no-abusive-eslint-disable'] = 'off';
  }
}

export { default } from 'ultracite';
