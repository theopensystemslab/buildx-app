import Radio from "@/app/ui/Radio";
import { A, EQ, Ord, S } from "@/app/utils/functions";
import { WatsonHealthSubVolume } from "@carbon/icons-react";
import { BuildMaterial, ScopeElement } from "@opensystemslab/buildx-core";
import { pipe } from "fp-ts/lib/function";
import { memo, useRef } from "react";
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

  const allMaterials = pipe(
    [currentMaterial, ...otherMaterials],
    A.uniq(
      pipe(
        S.Eq,
        EQ.contramap((m: Omit<BuildMaterial, "imageUrl">) => m.specification)
      )
    ),
    A.sort(
      pipe(
        S.Ord,
        Ord.contramap((m: Omit<BuildMaterial, "imageUrl">) => m.specification)
      )
    )
  );

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
          // @ts-ignore
          thumbnail: material.imageBlob
            ? // @ts-ignore
              URL.createObjectURL(material.imageBlob)
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

export default memo(ChangeMaterial);
