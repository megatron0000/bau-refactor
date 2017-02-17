# bau-refactor

 CLI to refactor (move) typescript files correcting imports

 This is a work in progress (now has automated tests - not 100% - and applies inversion of control).

 So far, it works like:

  1. Go to a  project root (dir containing tsconfig.json)
  2. Suppose you want to move ``src/classA.ts`` to ``src/somePackage/classA.ts``. 
  3. You say: ``bau-move ./src/classA.ts ./src/somePackage/classA.ts``
  4. The file gets moved, all its **relative** imports are updated in the moved file (so nothing breaks) and all files that imported yours using relative paths are also updated (all involved files should have been saved beforehand)

 Some details:
  
  1. Save your source files before attempting to move one of them !
  2. Only ``.ts``, ``.d.ts`` and ``.tsx`` files can be moved
  3. Should work for both Windows and UNIX. So, ``bau-move a\b.ts a\c.ts`` should work, for example.
  4. CLI commands consider your cwd as a "project root" and will only see source files under this directory.
  5. Should something go wrong while processing the move, nothing will be done and an error message will be displayed (the exception here is if some IO error occurs while import statements are being corrected in source files, case in which the move will fail half-way, with some corrections done and others not)
 
# Caution

 No guarantee of properly working at all cases. Does not support rootDirs or paths in tsconfig.json. Only cares about **relative** imports
 (those starting with ``'./'`` or ``'../'``)

# Changelog

 ## 1.0.3

  - Introduces spec for every class but FileMover.
  - Removes global dependency on rimraf (unless for developing the package, which is not the case of someone who only uses its move feature)

 ## 1.0.4

  - bau-move command no longer displays horrible stack-traces, only short error message (in case of failure, obviously)