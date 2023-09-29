import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GET_PRODUCT_APPROVAL_DETAIL_URL } from "../../commons/constants/api-urls";
import useFetch from "../../commons/hooks/useFetch";
import CreateUpdateProductApprovalForm, {
  ProductActionType,
} from "../../components/Form/CreateUpdateProductForm/CreateUpdateProductApprovalForm";
import { ProductItemApproval } from "../../components/ProductManagement";
import { AppContext } from "../../contexts/AppContext";
import NotFoundPage from "../NotFound";

const makeProductFromDto = (dto: CreateUpdateProductBody, productId: number): Product => {
  return {
    name: dto.name,
    status: dto.status,
    id: productId,
    settings: dto.settings,
    total_sales: 0,
    brand: dto.brand,
    attributes: dto.attributes,
    category_id: dto.category_id,
    condition: dto.condition,
    depth: dto.depth,
    height: dto.height,
    images: dto.images,
    day_to_prepare_order: dto.day_to_prepare_order,
    description: dto.description,
    lead_time: dto.lead_time,
    main_tags: dto.main_tags,
    sub_tags: dto.sub_tags,
    manufacturer: dto.manufacturer,
    price: dto.price,
    product_warranty: dto.product_warranty,
    sku: dto.sku,
    manufacturer_address: dto.manufacturer_address,
    width: dto.width,
    shipment_weight: dto.shipment_weight,
    videos: dto.videos,
    thumbnail: dto.thumbnail,
    warranty: dto.warranty,
    merchant_store_id: dto.merchant_store_id,
    is_sold_out: false,
  };
};

const CreateUpdateProductApprovalPage: React.FC = () => {
  const { setCurrentStore, store } = useContext(AppContext);
  const { storeId, approvalId } = useParams<{ storeId: string; approvalId: string }>();
  useEffect(() => {
    setCurrentStore(store.data.find(item => item.id.toString() === storeId) || null);
  }, [storeId, setCurrentStore, store]);

  const { data: approval } = useFetch<ProductItemApproval>(
    approvalId ? GET_PRODUCT_APPROVAL_DETAIL_URL(approvalId) : ""
  );

  if (approvalId && approval === null) return <NotFoundPage />;

  let productData: Product | null = null;
  if (approval) {
    if (approval.type === ProductActionType.CREATE) {
      productData = makeProductFromDto(approval.payload, 0);
    } else if (approval.type === ProductActionType.UPDATE) {
      productData = makeProductFromDto(approval.payload, approval.id);
    } else if (approval.type === ProductActionType.PUBLISH) {
      productData = approval.product ? approval.product : null;
    }
  }

  return (
    <CreateUpdateProductApprovalForm
      product={productData}
      approvalId={approvalId ? Number(approvalId) : 0}
      approvalType={approval ? approval.type : ""}
    />
  );
};

export default CreateUpdateProductApprovalPage;
