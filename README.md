# Tiny Entity Pack
This is a small library of custom entities for Serious Sam v1.07 based on Custom Entities Library (and is built within it as another entity pack) - https://github.com/DreamyCecil/SeriousSam_CustomEntitiesLib

This SDK contains only the Tiny Entity Pack sources and the project files were created for Visual Studio 2013 Professional edition.

Building
--------

To compile the library, you'll need to use a compiler from Microsoft Visual C++ 6.0.

1. First, you need to download and install `Microsoft Visual C++ 6.0` with Service Pack 6. Keep in mind that it may not run on your OS correctly or finish the installation at all, you'll have to go to the installation place (e.g. `C:\Program Files (x86)\Microsoft Visual Studio\VC98`) and see if there is anything (should run correctly on Windows 7 x64 and lower).
2. Second, you need to download and install `Visual Studio 2010` (only C++ tools are enough).
3. Then you need to install `Visual Studio 2013` (or even newer, although it wasn't tested). After this you'll be able to open the project files, but you can't compile them using the `v60` toolset yet.
4. Now you need to download and install `Daffodil`. It's a set of configuration files that allows newer Visual Studios to target older VC compilers.
As said on the http://daffodil.codeplex.com/ , it is possible to use newer Visual Studios as long as Visual Studio 2010 is also installed, otherwise it won't work.

Now you are able to build the entire solution (`TinyEntityPack.sln`) but make sure that the project has `v60` set as their platform toolset (**Project properties** -> **Configuration Properties** -> **General** -> **Platform Toolset**).

**NOTE:** Debugging tools from newer studios are unable to use program database files (.PDB) that are generated with `v60`, making traditional debugging impossible. If you wish to debug your code normally, consider using Microsoft Visual C++ 6.0 or if you can't use it, base it on Serious Engine v1.10 and then port the code back to this project.

Remember to **not** use spaces in the path to the solution.

Running
-------

Once the project is compiled, there should be a `TinyEntityPackMP.dll` library in the release folder (`TinyEntityPack/Release`) and in the Bin folder two levels above the sources folder (e.g `C:/SeriousSam/Bin` if the sources are in `C:/SeriousSam/Sources/TinyEntityPack`).

To change the path where to copy the library (if you wish to put sources separately from the game), consider changing the path in the custom build step (**Project properties** -> **Custom Build Step** -> **Command Line**).

How to use your new entities in the game:
1. Copy the library into the same folder as `EntitiesMP.dll` (e.g. `C:/SeriousSam/Bin`).
2. Create a .ecl (Entity Class Link) file with your entity in it. Entity Class Link files for this projects can be found in the `Classes` folder.
3. Add your class file into the virtual tree in Serious Editor.

And then you'll be able to use your entity just like any other entity.

When running a selected project, make sure the path in project properties **Debugging** -> **Command Arguments** is set to `SeriousEditor.exe` or `SeriousSam.exe` from the game where you copy your library to (e.g. `C:/SeriousSam/Bin/SeriousSam.exe`).

License
-------

This project is licensed under the GNU GPL v2 (see LICENSE file).
