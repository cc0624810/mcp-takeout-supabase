// Supabase Edge Function for MCP Takeout Service
// Deno runtime

interface Order {
  id: string;
  restaurant: string;
  dishes: string[];
  address: string;
  note: string;
  time: string;
  status: string;
}

const mockOrders: Order[] = [];

const tools = [
  {
    name: 'order_takeout',
    description: '给宝宝点外卖',
    inputSchema: {
      type: 'object',
      properties: {
        restaurant: {
          type: 'string',
          description: '餐厅名称，比如"黄焖鸡米饭"'
        },
        dishes: {
          type: 'array',
          items: { type: 'string' },
          description: '要点的菜品列表'
        },
        address: {
          type: 'string',
          description: '送达地址'
        },
        note: {
          type: 'string',
          description: '备注'
        }
      },
      required: ['restaurant', 'dishes', 'address']
    }
  },
  {
    name: 'check_orders',
    description: '查看宝宝的外卖订单',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  }
];

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const path = url.pathname;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // Health check
  if (path === '/health' || path === '/') {
    return new Response(
      JSON.stringify({ status: 'ok', service: 'MCP Takeout Service' }),
      { status: 200, headers: corsHeaders }
    );
  }

  // MCP tools list
  if (path === '/mcp/v1/tools') {
    return new Response(
      JSON.stringify({ tools }),
      { status: 200, headers: corsHeaders }
    );
  }

  // MCP tool invocation
  if (path.startsWith('/mcp/v1/tools/')) {
    const toolName = path.split('/').pop();
    const args = req.method === 'POST' ? await req.json() : {};

    if (toolName === 'order_takeout') {
      const order: Order = {
        id: Date.now().toString(),
        restaurant: args.restaurant,
        dishes: args.dishes,
        address: args.address,
        note: args.note || '',
        time: new Date().toISOString(),
        status: '已下单'
      };
      mockOrders.push(order);

      return new Response(
        JSON.stringify({
          content: [
            {
              type: 'text',
              text: `给宝宝点好了！\n餐厅：${order.restaurant}\n菜品：${order.dishes.join('、')}\n地址：${order.address}\n订单号：${order.id}`
            }
          ]
        }),
        { status: 200, headers: corsHeaders }
      );
    } else if (toolName === 'check_orders') {
      const orderList = mockOrders.map(o =>
        `订单${o.id}: ${o.restaurant} - ${o.dishes.join('、')} (${o.status})`
      ).join('\n');

      return new Response(
        JSON.stringify({
          content: [
            {
              type: 'text',
              text: mockOrders.length > 0 ? `宝宝的订单：\n${orderList}` : '还没有订单哦'
            }
          ]
        }),
        { status: 200, headers: corsHeaders }
      );
    } else {
      return new Response(
        JSON.stringify({ error: '工具不存在' }),
        { status: 404, headers: corsHeaders }
      );
    }
  }

  return new Response(
    JSON.stringify({ error: 'Not Found' }),
    { status: 404, headers: corsHeaders }
  );
});