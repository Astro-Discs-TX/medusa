import { zodResolver } from "@hookform/resolvers/zod"
import { Button, ProgressStatus, ProgressTabs, toast } from "@medusajs/ui"
import { useEffect, useMemo, useState } from "react"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useCreateProduct } from "../../../../../hooks/api/products"
import {
  PRODUCT_CREATE_FORM_DEFAULTS,
  ProductCreateSchema,
} from "../../constants"
import { ProductCreateSchemaType } from "../../types"
import { normalizeProductFormValues } from "../../utils"
import { ProductCreateDetailsForm } from "../product-create-details-form"
import { ProductCreateOrganizeForm } from "../product-create-organize-form"
import { ProductCreateInventoryKitForm } from "../product-create-inventory-kit-form"
import { ProductCreateVariantsForm } from "../product-create-variants-form"

enum Tab {
  DETAILS = "details",
  ORGANIZE = "organize",
  VARIANTS = "variants",
  INVENTORY = "inventory",
}

type TabState = Record<Tab, ProgressStatus>

const SAVE_DRAFT_BUTTON = "save-draft-button"

let LAST_VISITED_TAB = null

export const ProductCreateForm = () => {
  const [tab, setTab] = useState<Tab>(Tab.DETAILS)
  const [tabState, setTabState] = useState<Record<TabState>>({
    [Tab.DETAILS]: "in-progress",
    [Tab.ORGANIZE]: "not-started",
    [Tab.VARIANTS]: "not-started",
    [Tab.INVENTORY]: "not-started",
  })

  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<ProductCreateSchemaType>({
    defaultValues: PRODUCT_CREATE_FORM_DEFAULTS,
    resolver: zodResolver(ProductCreateSchema),
  })

  const { mutateAsync, isPending } = useCreateProduct()

  const variantsField = useFieldArray({
    control: form.control,
    name: "variants",
  })

  const optionsField = useFieldArray({
    control: form.control,
    name: "options",
  })

  const watchedVariants = useWatch({
    control: form.control,
    name: "variants",
  })

  const showInventoryTab = useMemo(
    () => watchedVariants.some((v) => v.inventory_kit),
    [watchedVariants]
  )

  const handleSubmit = form.handleSubmit(
    async (values, e) => {
      if (!(e?.nativeEvent instanceof SubmitEvent)) {
        return
      }
      const submitter = e?.nativeEvent?.submitter as HTMLButtonElement

      if (!(submitter instanceof HTMLButtonElement)) {
        return
      }

      const isDraftSubmission = submitter.dataset.name === SAVE_DRAFT_BUTTON

      const payload = { ...values }

      await mutateAsync(
        normalizeProductFormValues({
          // TODO: workflow should handle inventory creation
          ...payload,
          status: (isDraftSubmission ? "draft" : "published") as any,
        }),
        {
          onSuccess: ({ product }) => {
            toast.success(t("general.success"), {
              dismissLabel: t("actions.close"),
              description: t("products.create.successToast", {
                title: product.title,
              }),
            })

            handleSuccess(`../${product.id}`)
          },
        }
      )
    },
    (err) => {
      console.log(err)
    }
  )

  const onNext = async (currentTab: Tab) => {
    // TODO: check this
    // const valid = await form.trigger()
    //
    // if (!valid) {
    //   return
    // }

    if (currentTab === Tab.DETAILS) {
      setTab(Tab.ORGANIZE)
    }

    if (currentTab === Tab.ORGANIZE) {
      setTab(Tab.VARIANTS)
    }

    if (currentTab === Tab.VARIANTS) {
      setTab(Tab.INVENTORY)
    }
  }

  useEffect(() => {
    const currentState = { ...tabState }
    if (tab === Tab.DETAILS) {
      currentState[Tab.DETAILS] = "in-progress"
    }
    if (tab === Tab.ORGANIZE) {
      currentState[Tab.DETAILS] = "completed"
      currentState[Tab.ORGANIZE] = "in-progress"
    }
    if (tab === Tab.VARIANTS) {
      currentState[Tab.DETAILS] = "completed"
      currentState[Tab.ORGANIZE] = "completed"
      currentState[Tab.VARIANTS] = "in-progress"
    }
    if (tab === Tab.INVENTORY) {
      currentState[Tab.DETAILS] = "completed"
      currentState[Tab.ORGANIZE] = "completed"
      currentState[Tab.VARIANTS] = "completed"
      currentState[Tab.INVENTORY] = "in-progress"
    }

    if (tab !== Tab.DETAILS && LAST_VISITED_TAB === Tab.DETAILS) {
      if (
        !form.getValues("enable_variants") &&
        !form.getValues("variants").length
      ) {
        optionsField.append({
          title: "Default option",
          values: ["Default option value"],
        })

        variantsField.append({
          title: "Default variant",
          should_create: true,
          variant_rank: 0,
          options: {
            "Default option": "Default option value",
          },
          inventory: [{ title: "", quantity: 0 }],
          is_default: true,
        })
      }
    }

    // if (tab === Tab.INVENTORY) {
    //   // initialize inventory array for variants which have `inventory_kit` enabled before navigating to the page
    //   watchedVariants.forEach((v, index) => {
    //     if (v.inventory_kit && !v.inventory?.length) {
    //       form.setValue(`variants.${index}.inventory`, [
    //         { title: "", quantity: 0 },
    //       ])
    //     }
    //   })
    // }

    setTabState({ ...currentState })

    LAST_VISITED_TAB = tab
  }, [tab])

  return (
    <RouteFocusModal>
      <RouteFocusModal.Form form={form}>
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <ProgressTabs
            value={tab}
            onValueChange={(tab) => setTab(tab as Tab)}
            className="flex h-full flex-col overflow-hidden"
          >
            <RouteFocusModal.Header>
              <div className="flex w-full items-center justify-between gap-x-4">
                <div className="-my-2 w-fit border-l">
                  <ProgressTabs.List className="grid w-full grid-cols-4">
                    <ProgressTabs.Trigger
                      status={tabState[Tab.DETAILS]}
                      value={Tab.DETAILS}
                    >
                      {t("products.create.tabs.details")}
                    </ProgressTabs.Trigger>
                    <ProgressTabs.Trigger
                      status={tabState[Tab.ORGANIZE]}
                      value={Tab.ORGANIZE}
                    >
                      {t("products.create.tabs.organize")}
                    </ProgressTabs.Trigger>
                    <ProgressTabs.Trigger
                      status={tabState[Tab.VARIANTS]}
                      value={Tab.VARIANTS}
                    >
                      {t("products.create.tabs.variants")}
                    </ProgressTabs.Trigger>
                    {showInventoryTab && (
                      <ProgressTabs.Trigger
                        status={tabState[Tab.INVENTORY]}
                        value={Tab.INVENTORY}
                      >
                        {t("products.create.tabs.inventory")}
                      </ProgressTabs.Trigger>
                    )}
                  </ProgressTabs.List>
                </div>
                <div className="flex items-center justify-end gap-x-2">
                  <RouteFocusModal.Close asChild>
                    <Button variant="secondary" size="small">
                      {t("actions.cancel")}
                    </Button>
                  </RouteFocusModal.Close>
                  <Button
                    data-name={SAVE_DRAFT_BUTTON}
                    size="small"
                    type="submit"
                    isLoading={isPending}
                    className="whitespace-nowrap"
                  >
                    {t("actions.saveAsDraft")}
                  </Button>
                  <PrimaryButton
                    tab={tab}
                    next={onNext}
                    isLoading={isPending}
                    showInventoryTab={showInventoryTab}
                  />
                </div>
              </div>
            </RouteFocusModal.Header>
            <RouteFocusModal.Body className="size-full overflow-hidden">
              <ProgressTabs.Content
                className="size-full overflow-y-auto"
                value={Tab.DETAILS}
              >
                <ProductCreateDetailsForm form={form} />
              </ProgressTabs.Content>
              <ProgressTabs.Content
                className="size-full overflow-y-auto"
                value={Tab.ORGANIZE}
              >
                <ProductCreateOrganizeForm form={form} />
              </ProgressTabs.Content>
              <ProgressTabs.Content
                className="size-full overflow-y-auto"
                value={Tab.VARIANTS}
              >
                <ProductCreateVariantsForm form={form} />
              </ProgressTabs.Content>
              {showInventoryTab && (
                <ProgressTabs.Content
                  className="size-full overflow-y-auto"
                  value={Tab.INVENTORY}
                >
                  <ProductCreateInventoryKitForm form={form} />
                </ProgressTabs.Content>
              )}
            </RouteFocusModal.Body>
          </ProgressTabs>
        </form>
      </RouteFocusModal.Form>
    </RouteFocusModal>
  )
}

type PrimaryButtonProps = {
  tab: Tab
  next: (tab: Tab) => void
  isLoading?: boolean
  showInventoryTab: boolean
}

const PrimaryButton = ({
  tab,
  next,
  isLoading,
  showInventoryTab,
}: PrimaryButtonProps) => {
  const { t } = useTranslation()

  if (
    (tab === Tab.VARIANTS && !showInventoryTab) ||
    (tab === Tab.INVENTORY && showInventoryTab)
  ) {
    return (
      <Button
        data-name="publish-button"
        key="submit-button"
        type="submit"
        variant="primary"
        size="small"
        isLoading={isLoading}
      >
        {t("actions.publish")}
      </Button>
    )
  }

  return (
    <Button
      key="next-button"
      type="button"
      variant="primary"
      size="small"
      onClick={() => next(tab)}
    >
      {t("actions.continue")}
    </Button>
  )
}
