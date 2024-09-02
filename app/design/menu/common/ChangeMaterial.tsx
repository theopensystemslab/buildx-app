import Radio from "@/app/ui/Radio";
import { WatsonHealthSubVolume } from "@carbon/icons-react";
import { ScopeElement } from "@opensystemslab/buildx-core";
import { useRef } from "react";
import ContextMenuHeading from "../common/ContextMenuHeading";
import ContextMenuNested from "../common/ContextMenuNested";

type Props = {
  scopeElement: ScopeElement;
  close: () => void;
};

const ChangeMaterial = (props: Props) => {
  const {
    scopeElement: {
      elementGroup,
      elementGroup: {
        userData: { element },
      },
    },
    close,
  } = props;

  const { ifcTag } = element;

  const closing = useRef(false);

  const elementsManager = elementGroup.houseGroup.managers.elements;

  if (!elementsManager) return null;

  const { currentMaterial, otherMaterials } =
    elementsManager.getElementMaterialOptions(ifcTag);

  const allMaterials = [currentMaterial, ...otherMaterials];

  return otherMaterials.length > 0 ? (
    <ContextMenuNested
      long
      label={`Change material`}
      icon={<WatsonHealthSubVolume size={20} />}
    >
      {/* <ChangeMaterialOptions {...props} /> */}

      <ContextMenuHeading>{element.name}</ContextMenuHeading>
      <Radio
        options={allMaterials.map((material) => ({
          label: material.specification,
          value: material,
          thumbnail: material.imageBlob
            ? URL.createObjectURL(material.imageBlob)
            : undefined,
        }))}
        selected={currentMaterial}
        onChange={(newMaterial) => {
          closing.current = true;

          elementsManager.setElementMaterial(ifcTag, newMaterial.specification);

          // elementsManager.updateDB()

          close();
        }}
        onHoverChange={(hoveredMaterial) => {
          if (closing.current) return;

          if (hoveredMaterial) {
            elementsManager.setElementMaterial(
              ifcTag,
              hoveredMaterial.specification
            );
          } else {
            elementsManager.setElementMaterial(
              ifcTag,
              currentMaterial.specification
            );
          }
        }}
      />
    </ContextMenuNested>
  ) : null;
};

export default ChangeMaterial;
