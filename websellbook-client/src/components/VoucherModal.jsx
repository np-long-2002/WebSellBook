import { useEffect, useState } from "react";

function VoucherModal({
  isOpen,
  onClose,
  onSave,
  voucher
}) {

  const [form, setForm] =
    useState({
      code: "",
      discountPercent: 10,
      maxDiscountAmount: 50000,
      minOrderAmount: 100000,
      quantity: 100,
      startDate: "",
      expiredAt: ""
    });

  useEffect(() => {

    if (voucher) {

      setForm({
        code: voucher.code,
        discountPercent:
          voucher.discountPercent,
        maxDiscountAmount:
          voucher.maxDiscountAmount,
        minOrderAmount:
          voucher.minOrderAmount,
        quantity:
          voucher.quantity,
        startDate:
          voucher.startDate?.substring(0,10),
        expiredAt:
          voucher.expiredAt?.substring(0,10)
      });

    }

  }, [voucher]);

  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl p-6 w-[700px]">

        <h2 className="text-2xl font-bold mb-5">
          {voucher
            ? "Update Voucher"
            : "Create Voucher"}
        </h2>

        <div className="grid grid-cols-2 gap-4">

          <input
            placeholder="Code"
            value={form.code}
            onChange={(e)=>
              setForm({
                ...form,
                code:e.target.value
              })
            }
            className="border p-3 rounded-xl"
          />

          <input
            type="number"
            placeholder="Discount %"
            value={form.discountPercent}
            onChange={(e)=>
              setForm({
                ...form,
                discountPercent:
                Number(e.target.value)
              })
            }
            className="border p-3 rounded-xl"
          />

          <input
            type="number"
            placeholder="Max Discount"
            value={form.maxDiscountAmount}
            onChange={(e)=>
              setForm({
                ...form,
                maxDiscountAmount:
                Number(e.target.value)
              })
            }
            className="border p-3 rounded-xl"
          />

          <input
            type="number"
            placeholder="Min Order"
            value={form.minOrderAmount}
            onChange={(e)=>
              setForm({
                ...form,
                minOrderAmount:
                Number(e.target.value)
              })
            }
            className="border p-3 rounded-xl"
          />

          <input
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e)=>
              setForm({
                ...form,
                quantity:
                Number(e.target.value)
              })
            }
            className="border p-3 rounded-xl"
          />

          <div />

          <input
            type="date"
            value={form.startDate}
            onChange={(e)=>
              setForm({
                ...form,
                startDate:e.target.value
              })
            }
            className="border p-3 rounded-xl"
          />

          <input
            type="date"
            value={form.expiredAt}
            onChange={(e)=>
              setForm({
                ...form,
                expiredAt:e.target.value
              })
            }
            className="border p-3 rounded-xl"
          />

        </div>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="px-5 py-3 bg-gray-300 rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={() => onSave(form)}
            className="px-5 py-3 bg-blue-600 text-white rounded-xl"
          >
            Save
          </button>

        </div>

      </div>

    </div>
  );
}

export default VoucherModal;