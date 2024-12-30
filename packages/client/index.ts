function getElWithSourceCodeLocation(el: HTMLElement | null) {
  try {
    while(el && !el.dataset.__sourceCodeLocation) {
      el = el.parentElement;
    } 
  } catch (error) {
    return null
  }

  return el
}

function setElTargetAttr(el: HTMLElement, type: string) {
  el.setAttribute('vue-click-to-component-target', type)
}

function cleanElTargetAttr() {
  const targetElList = document.querySelectorAll(
    "[vue-click-to-component-target]",
  );
  targetElList.forEach((el) => {
    el.removeAttribute("vue-click-to-component-target");
  });
}

document.addEventListener('mousemove', (e) => {
  cleanElTargetAttr()
  
  if (e.altKey) {
    const elWithSourceCodeLocation = getElWithSourceCodeLocation(e.target as HTMLElement);
    if (!elWithSourceCodeLocation) {
      return
    }

    setElTargetAttr(elWithSourceCodeLocation, 'hover');
  }
})

document.addEventListener("blur", () => {
    cleanElTargetAttr();
  },
);

document.addEventListener('click', (e) => {
  if (e.altKey) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const elWithSourceCodeLocation = getElWithSourceCodeLocation(e.target as HTMLElement);
    if (elWithSourceCodeLocation && elWithSourceCodeLocation.dataset.__sourceCodeLocation) {
      openEditor(elWithSourceCodeLocation.dataset.__sourceCodeLocation)
    }
    
  }
})

function openEditor(filePath: string) {
  if (!filePath.startsWith('/')) {
    filePath = '/' + filePath;
  }
  window.location.assign(`vscode://file${filePath}`)
}

document.head.insertAdjacentHTML('beforeend', `
<style type="text/css">
[vue-click-to-component-target] {
  cursor: pointer !important;
  outline: 1px auto !important;
}
</style>
`)