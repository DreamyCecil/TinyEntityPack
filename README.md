# Tiny Entity Pack
This is a small library of custom entities for Serious Sam v1.07 based on Custom Entities Library (and is built within it as another entity pack) - https://github.com/DreamyCecil/SeriousSam_CustomEntitiesLib

This SDK contains only the Tiny Entity Pack sources and the project files were created for Visual Studio 2013 Professional edition.

Building
--------

To compile the library, you'll need to use a compiler from Microsoft Visual C++ 6.0.

Full guide: https://github.com/DreamyCecil/SeriousSam_SDK107#building

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
