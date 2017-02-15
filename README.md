# bau-refactor
CLI to refactor (move) typescript files correcting imports

This is a work in progress (does not even have automated tests yet, and I´m considering inversion of control).

So far, it works like:

 1. Go to a  project root (dir containign tsconfig.json)
 2. Suppose you want to move ``src/classA.ts`` to ``src/somePackage/classA.ts``. 
 3. You say: ``bau-move ./src/classA.ts ./src/somePackage/classA.ts``
 4. The file gets moved, all its **relative** imports are updated in the moved file (so nothing breaks) and all files that imported 
 yours using relative paths are also updated (they should have been saved beforehand)
 
# Caution
No guarantee of properly working at all cases. Does not support rootDirs, or paths in tsconfig.json. Only cares about **relative** imports
(those starting with './' or '../')

# Changelog

## 1.0.3

- Introduces spec for every class but FileMover.
- Removes global dependency on rimraf (unless for developing the package, which is not the case of someone who only uses
its move feature)
