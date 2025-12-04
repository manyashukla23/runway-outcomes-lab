{{
  config(
    materialized='table'
  )
}}

select
    id as customer_id,
    first_name,
    last_name,
    gender,
    age,
    case
        when age < 18 then 'Under 18'
        when age < 25 then '18-24'
        when age < 35 then '25-34'
        when age < 45 then '35-44'
        when age < 55 then '45-54'
        when age < 65 then '55-64'
        else '65+'
    end as age_band,
    country,
    city,
    state,
    email,
    created_at as customer_since
from {{ ref('stg_users') }}

