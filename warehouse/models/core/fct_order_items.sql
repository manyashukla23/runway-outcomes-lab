{{
  config(
    materialized='table'
  )
}}

select
    oi.id as order_item_id,
    oi.order_id,
    oi.user_id,
    oi.product_id,
    o.order_id as order_number,
    o.status as order_status,
    o.created_at as order_created_at,
    o.shipped_at,
    o.delivered_at,
    o.returned_at as order_returned_at,
    p.brand,
    p.category,
    p.department,
    p.retail_price,
    p.cost,
    u.age as customer_age,
    u.gender as customer_gender,
    u.country as customer_country,
    oi.sale_price,
    oi.discount,
    oi.status as item_status,
    oi.created_at as item_created_at,
    oi.returned_at as item_returned_at,
    case
        when oi.status = 'Returned' or oi.returned_at is not null then true
        else false
    end as is_returned,
    oi.sale_price - oi.discount as net_revenue,
    oi.discount / nullif(oi.sale_price, 0) as discount_pct
from {{ ref('stg_order_items') }} oi
left join {{ ref('stg_orders') }} o
    on oi.order_id = o.id
left join {{ ref('stg_products') }} p
    on oi.product_id = p.id
left join {{ ref('stg_users') }} u
    on oi.user_id = u.id

