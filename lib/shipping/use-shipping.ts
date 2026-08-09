'use client';

import { useState, useEffect } from 'react';
import { getShippingFeeAction } from '../../app/[clientSlug]/[pageSlug]/actions';
import { WILAYAS, type Wilaya } from '../wilayas';

interface UseShippingProps {
  clientId: string;
  initialCity?: string;
  price: number;
  initialQuantity?: number;
}

export function useShipping({
  clientId,
  initialCity,
  price,
  initialQuantity = 1,
}: UseShippingProps) {
  const [city, setCity] = useState(initialCity || WILAYAS[15]?.nameAr || 'الجزائر');
  const [deliveryType, setDeliveryType] = useState<'home' | 'stopdesk'>('home');
  const [quantity, setQuantity] = useState(initialQuantity);
  const [shippingFee, setShippingFee] = useState(400); // default fallback
  const [loading, setLoading] = useState(true);

  const currentWilaya = WILAYAS.find((w) => w.nameAr === city) || WILAYAS[15];

  useEffect(() => {
    let active = true;
    setLoading(true);

    getShippingFeeAction(clientId, city, deliveryType)
      .then((res) => {
        if (active) {
          setShippingFee(res.fee);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching shipping fee in hook:', err);
        if (active) {
          // Fall back to static wilaya fee
          const homeFee = currentWilaya?.shippingFee || 500;
          setShippingFee(deliveryType === 'home' ? homeFee : Math.max(300, homeFee - 200));
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [clientId, city, deliveryType, currentWilaya]);

  const totalPrice = price * quantity + shippingFee;

  return {
    city,
    setCity,
    deliveryType,
    setDeliveryType,
    quantity,
    setQuantity,
    shippingFee,
    totalPrice,
    loading,
    wilaya: currentWilaya,
  };
}
