/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { schema } from '@kbn/config-schema';

import { RouteDependencies } from '../../../types';
import { addBasePath } from '../index';

const bodySchema = schema.object({
  indices: schema.arrayOf(schema.string()),
});

export function registerFreezeRoute({ router, license, lib }: RouteDependencies) {
  router.post(
    { path: addBasePath('/indices/freeze'), validate: { body: bodySchema } },
    license.guardApiRoute(async (ctx, req, res) => {
      const body = req.body as typeof bodySchema.type;
      const { indices = [] } = body;

      const params = {
        path: `/${encodeURIComponent(indices.join(','))}/_freeze`,
        method: 'POST',
      };

      try {
        await await ctx.core.elasticsearch.legacy.client.callAsCurrentUser(
          'transport.request',
          params
        );
        return res.ok();
      } catch (e) {
        if (lib.isEsError(e)) {
          return res.customError({
            statusCode: e.statusCode,
            body: e,
          });
        }
        // Case: default
        throw e;
      }
    })
  );
}
