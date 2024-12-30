import htmlTags from 'html-tags';
import { parseFragment, serialize } from 'parse5';
import type { Plugin } from 'rollup'

function getSourceWithSourceCodeLocation(code: string, id: string) {
  const ast = parseFragment(code, {
    sourceCodeLocationInfo: true
  })

  let allNodes: any[] = [ast];
  let nodeIndex = 0;
  while(allNodes.length > nodeIndex) {
    allNodes = allNodes.concat(
      allNodes[nodeIndex]?.childNodes || [],
      allNodes[nodeIndex]?.content?.childNodes || []
    )
    nodeIndex++;
  }

  const sortedNodes = allNodes
    .filter((node) => {

      if (!htmlTags.includes(node?.nodeName)) {
        return false;
      }
      if (node.nodeName === 'template' || node.nodeName === 'script' || node.nodeName === 'style') {
        return false;
      }

      return true;
    })
    // 根据 startOffset 逆序
    .sort(
      (a, b) =>
        b.sourceCodeLocation.startOffset - a.sourceCodeLocation.startOffset,
    );
  
  let result = code;
  sortedNodes.forEach((node) => {
    const { startOffset, startLine, startCol } = node.sourceCodeLocation;
    const sourceCodeLocation = ` data-__source-code-location="${id}:${startLine}:${startCol}" `;
    const insertPos = startOffset + node.nodeName.length + 1;
    result = result.substring(0, insertPos) + sourceCodeLocation + result.substring(insertPos)
  })

  console.log('----------');
  console.log(result);

  return result;
}

// function getSourceWithSourceCodeLocation(code: string, id: string) {
//   const ast = parseFragment(code, {
//     sourceCodeLocationInfo: true
//   })

//   traverseAndModify(ast, id);
  
//   // 将修改后的 AST 序列化为 HTML
//   // 存在问题是会把template中驼峰的组件名称变成小写，导致组件渲染不成功
//   const result = serialize(ast).replace('helloworld', 'HelloWorld');
//   console.log('---------------')
//   console.log(result);
//   return result;
// }

// function traverseAndModify(node: any, id: string) {
//   if (htmlTags.includes(node.tagName) && (!['template', 'script', 'style'].includes(node.tagName))) {
//     const { startLine, startCol } = node.sourceCodeLocation;
//     node.attrs = [
//       ...node.attrs,
//       {
//         name: 'data-__source-code-location',
//         value: `${id}:${startLine}:${startCol}`
//       }
//     ];
//   }

//   if (node.childNodes) {
//     node.childNodes.forEach((node: any) => traverseAndModify(node, id));
//     node.content?.childNodes.forEach((node: any) => traverseAndModify(node, id));
//   }
// }

export default function clickToVueComponentVitePlugin(): Plugin {
  return {
    name: 'clickToVueComponentVitePlugin',
    transform(code, id) {
      // 只在开发环境开启
      if (process.env.NODE_ENV !== 'development') {
        return code;
      }
      if (id.endsWith('.vue')) {
        try {
          return getSourceWithSourceCodeLocation(code, id)
        } catch (error) {
          console.error('error', id)
          return code;
        }
      }
      return code;
    }
  }
}
