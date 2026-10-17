# 3D Asset Attribution & Licensing

## Staunton Chess Knight (`public/models/staunton-knight.glb`)

- **Asset**: Staunton Chess Knight 3D Model
- **Source**: [clarkerubber/Staunton-Pieces](https://github.com/clarkerubber/Staunton-Pieces) (`Source/Staunton/Knight/Knight.STL`)
- **Author**: Copyright (c) 2014 clarkerubber
- **Usage Context**: Official 3D Staunton piece set created for [Lichess.org](https://lichess.org)
- **License**: MIT License
- **Processing**: 
  - Converted from CAD STL mesh to binary glTF 2.0 (`.glb`)
  - Normalized to origin with bottom-center alignment
  - Creased normals calculated (`toCreasedNormals` at 42°) for cinematic organic smoothing across the horse head, curved neck, muzzle, and mane, while preserving crisp geometric stepped base collars
  - Configured with custom Three.js PBR physical shaders (dark obsidian / brushed gunmetal finish, subtle metalness, controlled roughness, clearcoat reflections, and subtle cybernetic eye inlay)

### Full MIT License Text:

```
The MIT License (MIT)

Copyright (c) 2014 clarkerubber

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
