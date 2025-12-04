{{
  config(
    materialized='table'
  )
}}

select
    id as product_id,
    brand,
    category,
    department,
    name as product_name,
    retail_price,
    cost,
    (retail_price - cost) as margin,
    created_at
from {{ ref('stg_products') }}

